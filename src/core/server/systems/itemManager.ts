import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { BaseItem, StoredItem, Item, DefaultItemBehavior } from '@AthenaShared/interfaces/item';
import { deepCloneArray, deepCloneObject } from '@AthenaShared/utility/deepCopy';
import { GLOBAL_SYNCED } from '@AthenaShared/enums/globalSynced';
import { ItemFactory } from './itemFactory';

alt.setSyncedMeta(GLOBAL_SYNCED.INVENTORY_WEIGHT_ENABLED, true);

/**
 * Do not modify this directly.
 * These are used as internal values.
 * Use the config setter / getter in ItemManager system to modify.
 * @type {*}
 * */
let DEFAULT_CONFIG = {
    inventory: {
        size: 30,
    },
    toolbar: {
        size: 4,
    },
    custom: {
        size: 256,
    },
    weight: {
        enabled: true,
        player: 64,
    },
};

export interface ItemQuantityChange {
    /**
     * The modified item after making qunatity modifications to it.
     *
     * @type { Item | StoredItem }
     * @memberof ItemQuantityChange
     */
    item: Item | StoredItem;

    /**
     * The number of items that were not added to this stack.
     *
     * @type {number}
     * @memberof ItemQuantityChange
     */
    remaining: number;
}

type InventoryType = 'inventory' | 'toolbar' | 'custom';
type ComplexSwap = { slot: number; data: Array<StoredItem>; size: InventoryType | number; type: InventoryType };
export type ComplexSwapReturn = { from: Array<StoredItem>; to: Array<StoredItem> };

const InternalFunctions = {
    item: {
        /**
         * Calculate the total weight of the item, and return the modified item with total weight.
         *
         * @param {BaseItem} baseItem
         * @param {StoredItem} storedItem
         * @returns {StoredItem}
         */
        calculateWeight(baseItem: BaseItem, storedItem: StoredItem): StoredItem {
            if (typeof baseItem.weight === 'number' && storedItem.quantity !== 0) {
                const newItem = deepCloneObject<StoredItem>(storedItem);
                newItem.totalWeight = baseItem.weight * newItem.quantity;
                return newItem;
            }

            return storedItem;
        },
        /**
         * Modifies an item by adding or removing an amount.
         * The amount that did not get removed, or added is returned.
         * If the base item of the item is not found it will return undefined.
         * It will automatically re-calculate weight if the baseItem weight is present.
         *
         * @param {ItemType} item
         * @param {number} amount
         * @param {boolean} [isRemoving=false]
         * @return {ItemQuantityChange}
         */
        modifyQuantity(item: Item | StoredItem, amount: number, isRemoving: boolean = false): ItemQuantityChange {
            amount = Math.floor(amount);

            // Lookup the base item based on the dbName of the item.
            const baseItem = Athena.systems.itemFactory.sync.getBaseItem(item.dbName, item.version);
            if (typeof baseItem === 'undefined') {
                alt.logWarning(`ItemManager: Tried to lookup ${item.dbName}, but base item does not exist.`);
                return undefined;
            }

            // Prevent stacking / modifying quantity if adding to the item.
            if (!isRemoving && baseItem.behavior && !baseItem.behavior.canStack) {
                return undefined;
            }

            // Get the remaining that could not be added or removed due to either stack size, or not enough of this item to remove.
            let remaining = 0;
            if (isRemoving && item.quantity < amount) {
                remaining = amount - item.quantity;
                amount = item.quantity; // Set the amount to the item quantity since we are removing it all.
            }

            if (!isRemoving && typeof baseItem.maxStack === 'number' && item.quantity + amount > baseItem.maxStack) {
                remaining = item.quantity + amount - baseItem.maxStack;
                amount = baseItem.maxStack - item.quantity; // Set the amount to the total necessary to fulfill the maximum stack size.
            }

            // Add or remove quantity from the item
            let newItem = deepCloneObject<Item | StoredItem>(item);
            if (isRemoving) {
                newItem.quantity -= amount;
            } else {
                newItem.quantity += amount;
            }

            newItem = InternalFunctions.item.calculateWeight(baseItem, newItem);

            return {
                item: newItem,
                remaining,
            };
        },
    },
    inventory: {
        /**
         * Remove all items with zero quantity.
         *
         * @param {(Array<StoredItem | Item>)} items
         * @return {(Array<StoredItem | Item>)}
         */
        removeZeroQuantityItems(items: Array<StoredItem | Item>): Array<StoredItem | Item> {
            const newItemsArray = deepCloneArray<StoredItem | Item>(items);

            for (let i = newItemsArray.length - 1; i >= 0; i--) {
                if (typeof newItemsArray[i] === 'undefined') {
                    continue;
                }

                if (newItemsArray[i].quantity > 0) {
                    continue;
                }

                newItemsArray.splice(i, 1);
            }

            return newItemsArray;
        },
    },
};

export const ItemManager = {
    config: {
        /**
         * Modify the existing inventory configurations.
         * Values set may not work with interfaces designed for default values above.
         *
         * @param {typeof DEFAULT} config
         */
        set(config: typeof DEFAULT_CONFIG) {
            DEFAULT_CONFIG = Object.assign(DEFAULT_CONFIG, config);
            alt.setSyncedMeta(GLOBAL_SYNCED.INVENTORY_WEIGHT_ENABLED, DEFAULT_CONFIG.weight.enabled);
        },
        /**
         * Returns the current inventory configurations.
         *
         * @return {typeof DEFAULT}
         */
        get(): typeof DEFAULT_CONFIG {
            return DEFAULT_CONFIG;
        },
        disable: {
            /**
             * Use this function to disable weight restrictions on inventories.
             */
            weight() {
                DEFAULT_CONFIG.weight.enabled = false;
                alt.setSyncedMeta(GLOBAL_SYNCED.INVENTORY_WEIGHT_ENABLED, false);
            },
        },
    },
    quantity: {
        /**
         * Adds a quantity to a specified item.
         * Utilizes the base item to determine maximum stack.
         * Will return the remaining amount that was not added if a max stack size is present.
         * Will return undefined if the base item does not exist, or if the item simply cannot have quantity changed.
         * Recalculated weight on item if baseItem has weight present.
         *
         * If you wish to modify a full item use `add<Item>(...)`
         *
         * @param {(Item | StoredItem)} item
         * @param {number} amount
         * @return {ItemType | undefined}
         */
        add(item: Item | StoredItem, amount: number): ItemQuantityChange | undefined {
            return InternalFunctions.item.modifyQuantity(item, amount);
        },
        /**
         * Removes a quantity from a specified item.
         * Will return the remaining amount that was not removed if amount exceeds available in stack size.
         * Will return undefined if the base item does not exist, or if the item simply cannot have quantity changed.
         *
         * If you wish to modify a full item use `remove<Item>(...)`
         *
         * @param {(Item | StoredItem)} item
         * @param {number} amount
         * @return {ItemQuantityChange | undefined}
         */
        sub(item: Item | StoredItem, amount: number): ItemQuantityChange | undefined {
            return InternalFunctions.item.modifyQuantity(item, amount, true);
        },
        /**
         * Check if the player has enough of an item in a given data set.
         *
         * @param {Array<StoredItem>} dataSet
         * @param {string} dbName
         * @param {number} quantity
         * @param {number} [version=undefined]
         */
        has(dataSet: Array<StoredItem>, dbName: string, quantity: number, version: number = undefined): boolean {
            let count = 0;
            for (let item of dataSet) {
                if (item.dbName !== dbName) {
                    continue;
                }

                if (item.version !== version) {
                    continue;
                }

                count += item.quantity;
            }

            return count >= quantity;
        },
    },
    data: {
        /**
         * Update or insert the data field of an item with new data.
         * Any data that has a matching field with overwrite the existing field with the new data.
         * Always returns a new item with the modified contents.
         *
         * @template DataType
         * @param {(Item<DefaultItemBehavior, DataType> | StoredItem<DataType>)} item
         * @param {DataType} data
         */
        upsert<DataType = {}>(item: Item<DefaultItemBehavior, DataType> | StoredItem<DataType>, data: DataType) {
            const newItem = deepCloneObject<Item<DefaultItemBehavior, DataType> | StoredItem<DataType>>(item);
            if (typeof newItem.data !== 'object') {
                newItem.data = {} as DataType;
            }

            newItem.data = Object.assign(newItem.data, data);
            return newItem;
        },
        /**
         * Assign data to the data field.
         * Always returns a new item with the modified contents.
         *
         * @template DataType
         * @param {(Item<DefaultItemBehavior, DataType> | StoredItem<DataType>)} item
         * @param {DataType} data
         * @return {*}
         */
        set<DataType = {}>(item: Item<DefaultItemBehavior, DataType> | StoredItem<DataType>, data: DataType) {
            const newItem = deepCloneObject<Item<DefaultItemBehavior, DataType> | StoredItem<DataType>>(item);
            newItem.data = deepCloneObject(item);
            return newItem;
        },
        /**
         * Clears the data field of the item.
         * Sets it to an empty object.
         * Always returns a new item with the modified contents.
         *
         * @param {(Item | StoredItem)} item
         * @return {*}
         */
        clear(item: Item | StoredItem) {
            const newItem = deepCloneObject<Item | StoredItem>(item);
            newItem.data = {};
            return newItem;
        },
    },
    inventory: {
        /**
         * Converts a stored item list, to a full item list.
         *
         * @param {Array<StoredItem>} data
         * @return {Array<Item<DefaultItemBehavior, {}>>}
         */
        convertFromStored(data: Array<StoredItem<{}>>): Array<Item<DefaultItemBehavior, {}>> {
            const convertedItemList: Array<Item<DefaultItemBehavior, {}>> = [];

            for (let i = 0; i < data.length; i++) {
                const convertedItem = Athena.systems.itemFactory.sync.item.convert.fromStoredItem(data[i]);
                convertedItemList.push(convertedItem);
            }

            return convertedItemList;
        },
        /**
         * Adds or stacks an item based on the quantity passed.
         * Requires the basic version of a stored item to be added to a user.
         * Returns undefined if the data set could not be modified to include the quantity of items necessary.
         *
         * @param {Array<StoredItem>} data
         * @param {number} amount
         * @param {InventoryType | number} size The maximum slot size for this item group.
         * @return {Array<StoredItem>} Returns undefined or the new array of added items.
         */
        add<CustomData = {}>(
            item: Omit<StoredItem<CustomData>, 'slot'>,
            data: Array<StoredItem>,
            size: InventoryType | number = DEFAULT_CONFIG.custom.size,
        ): Array<StoredItem> | undefined {
            if (item.quantity <= -1) {
                alt.logWarning(`ItemManager: Cannot add negative quantity to an item.`);
                return undefined;
            }

            if (item.quantity === 0) {
                return data;
            }

            // Lookup the base item based on the dbName of the item.
            const baseItem = Athena.systems.itemFactory.sync.getBaseItem(item.dbName, item.version);
            if (typeof baseItem === 'undefined') {
                alt.logWarning(`ItemManager: Tried to lookup ${item.dbName}, but base item does not exist.`);
                return undefined;
            }

            const copyOfData = deepCloneArray<StoredItem>(data);
            let availableStackIndex = -1;
            if (baseItem.behavior.canStack && typeof baseItem.maxStack === 'number' && baseItem.maxStack > 1) {
                availableStackIndex = copyOfData.findIndex(
                    (x) => x.dbName === item.dbName && x.version === item.version && x.quantity !== baseItem.maxStack,
                );
            }

            // Handles the following:
            // - Adds unstackable items
            // - Adds an item with a max stack of 1
            // - Adds stackable items, and automatically tries to fill item quantity.
            if (!baseItem.behavior.canStack || baseItem.maxStack === 1 || availableStackIndex === -1) {
                // Ensure there is enough room to add items.
                if (data.length >= size) {
                    return undefined;
                }

                // Determine open slot for item.
                // If undefined; do not try to add anything else; return undefined as a failure.
                const openSlot = ItemManager.slot.findOpen(size, copyOfData);
                if (typeof openSlot === 'undefined') {
                    return undefined;
                }

                let itemClone = deepCloneObject<StoredItem>(item);
                itemClone.slot = openSlot;

                // Use quantity to subtract from max stack size or use amount left
                if (baseItem.behavior.canStack) {
                    itemClone.quantity = item.quantity < baseItem.maxStack ? item.quantity : baseItem.maxStack;
                    item.quantity -= itemClone.quantity;
                } else {
                    itemClone.quantity = 1;
                    item.quantity -= 1;
                }

                // Re-calculate item weight
                itemClone = InternalFunctions.item.calculateWeight(baseItem, itemClone);
                copyOfData.push(itemClone);

                if (item.quantity === 0) {
                    return copyOfData;
                }

                return ItemManager.inventory.add(item, copyOfData, size);
            }

            // If the item.quantity is less than the stack size and less than or equal to amount missing. Simply add to it.
            const amountMissing = baseItem.maxStack - copyOfData[availableStackIndex].quantity;
            if (item.quantity <= amountMissing) {
                copyOfData[availableStackIndex].quantity += item.quantity;
                copyOfData[availableStackIndex] = InternalFunctions.item.calculateWeight(
                    baseItem,
                    copyOfData[availableStackIndex],
                );

                return copyOfData;
            }

            // Otherwise add the amount missing to this stack.
            // Subtract amount missing from original item quantity.
            // Call the same function again.
            copyOfData[availableStackIndex].quantity += amountMissing;
            copyOfData[availableStackIndex] = InternalFunctions.item.calculateWeight(
                baseItem,
                copyOfData[availableStackIndex],
            );

            item.quantity -= amountMissing;
            return ItemManager.inventory.add(item, copyOfData, size);
        },
        /**
         * Subtract an item quantity from a data set.
         *
         * @template CustomData
         * @param {StoredItem<CustomData>} item
         * @param {Array<StoredItem>} data
         * @return {(Array<StoredItem> | undefined)}
         */
        sub<CustomData = {}>(
            item: Omit<StoredItem<CustomData>, 'slot' | 'data'>,
            data: Array<StoredItem>,
        ): Array<StoredItem> | undefined {
            if (item.quantity <= -1) {
                alt.logWarning(`ItemManager: Cannot subtract negative quantity from an item.`);
                return undefined;
            }

            if (item.quantity === 0) {
                return data;
            }

            // Lookup the base item based on the dbName of the item.
            const baseItem = Athena.systems.itemFactory.sync.getBaseItem(item.dbName, item.version);
            if (typeof baseItem === 'undefined') {
                alt.logWarning(`ItemManager: Tried to lookup ${item.dbName}, but base item does not exist.`);
                return undefined;
            }

            const copyOfData = deepCloneArray<StoredItem>(data);
            const existingItemIndex = copyOfData.findIndex(
                (x) => x.dbName === item.dbName && x.version === item.version,
            );

            // Pretty much means there are not more items to remove from.
            // Return undefined.
            if (existingItemIndex <= -1) {
                return undefined;
            }

            // If the item we are removing from does not have enough quantity
            // Get the amount we are going to remove.
            // Remove that item from the data set.
            // Repeat subtraction of item.

            // The item quantity that we looked up is less than the amount we want to remove.
            // Recursively repeat removing until all are removed.
            if (copyOfData[existingItemIndex].quantity <= item.quantity) {
                item.quantity -= copyOfData[existingItemIndex].quantity;
                copyOfData.splice(existingItemIndex, 1);
                return ItemManager.inventory.sub(item, copyOfData);
            }

            // If the quantity of the found item is greater than; subtract necessary amount.
            copyOfData[existingItemIndex].quantity -= item.quantity;
            copyOfData[existingItemIndex] = InternalFunctions.item.calculateWeight(
                baseItem,
                copyOfData[existingItemIndex],
            );

            return copyOfData;
        },

        /**
         * Returns the total weight of a given data set.
         *
         * @param {Array<StoredItem>} data
         * @return {number}
         */
        getWeight(data: Array<StoredItem | Item>): number {
            let totalWeight = 0;
            for (let item of data) {
                if (!item.totalWeight) {
                    continue;
                }

                totalWeight += item.totalWeight;
            }

            return totalWeight;
        },
        /**
         * Get the total weight for given data sets.
         *
         * @param {(Array<Array<StoredItem | Item>>)} dataSets
         * @return {number}
         */
        getTotalWeight(dataSets: Array<Array<StoredItem | Item>>): number {
            let weight = 0;

            for (let dataSet of dataSets) {
                weight += ItemManager.inventory.getWeight(dataSet);
            }

            return weight;
        },
        /**
         * Determine if the weight is exceeded for a given data sets given the amount of weight it cannot exceed.
         *
         * @param {(Array<Array<StoredItem | Item>>)} dataSets
         * @param {number} [amount=DEFAULT_CONFIG.weight.player]
         * @return {boolean}
         */
        isWeightExceeded(
            dataSets: Array<Array<StoredItem | Item>>,
            amount: number = DEFAULT_CONFIG.weight.player,
        ): boolean {
            if (!DEFAULT_CONFIG.weight.enabled) {
                return false;
            }

            const total = ItemManager.inventory.getTotalWeight(dataSets);
            if (total > amount) {
                return true;
            }

            return false;
        },
    },
    slot: {
        /**
         * Returns a numerical representation for a free slot.
         * If there are no more free slots for a given type it will return undefined.
         *
         * @param {InventoryType} type
         * @param {Array<StoredItem>} data
         * @return {(number | undefined)}
         */
        findOpen(slotSize: InventoryType | number, data: Array<StoredItem>): number | undefined {
            if (typeof slotSize === 'string') {
                if (!DEFAULT_CONFIG[String(slotSize)]) {
                    return undefined;
                }
            }

            const maxSlot = typeof slotSize === 'number' ? Number(slotSize) : DEFAULT_CONFIG[String(slotSize)].size;

            for (let i = 0; i < maxSlot; i++) {
                const index = data.findIndex((x) => x.slot === i);
                if (index >= 0) {
                    continue;
                }

                return i;
            }

            return undefined;
        },
        /**
         * Get an item at a specific slot.
         * Returns undefined if an item is unavailable in a slot.
         *
         * @param {number} slot
         * @param {Array<StoredItem>} data
         * @return {(StoredItem | undefined)}
         */
        getAt(slot: number, data: Array<StoredItem>): StoredItem | undefined {
            const index = data.findIndex((x) => x.slot === slot);
            if (index <= -1) {
                return undefined;
            }

            return data[index];
        },
        /**
         * Remove a specific item from a specific slot.
         *
         * @param {number} slot
         * @param {Array<StoredItem>} data
         * @return {(Array<StoredItem> | undefined)} Returns undefined if the item was not found.
         */
        removeAt(slot: number, data: Array<StoredItem>): Array<StoredItem> | undefined {
            const copyOfData = deepCloneArray<StoredItem>(data);
            const index = copyOfData.findIndex((x) => x.slot === slot);
            if (index <= -1) {
                return undefined;
            }

            copyOfData.splice(index, 1);
            return copyOfData;
        },
        /**
         * Split an item into a new item given the slot number, and a split size.
         *
         * @param {number} slot
         * @param {Array<StoredItem>} data
         * @param {number} splitCount
         * @param {(InventoryType | number)} [size=DEFAULT_CONFIG.custom.size]
         */
        splitAt(
            slot: number,
            data: Array<StoredItem>,
            splitCount: number,
            dataSize: InventoryType | number = DEFAULT_CONFIG.custom.size,
        ): Array<StoredItem> | undefined {
            if (splitCount <= 0) {
                return undefined;
            }

            let copyOfData = deepCloneArray<StoredItem>(data);
            if (typeof dataSize === 'string') {
                dataSize = DEFAULT_CONFIG[dataSize].size;
            }

            if (data.length >= dataSize) {
                return undefined;
            }

            const index = copyOfData.findIndex((x) => x.slot === slot);
            if (index <= -1) {
                return undefined;
            }

            const openSlot = ItemManager.slot.findOpen(dataSize, copyOfData);
            if (typeof openSlot === 'undefined') {
                return undefined;
            }

            const baseItem = Athena.systems.itemFactory.sync.getBaseItem(
                copyOfData[index].dbName,
                copyOfData[index].version,
            );

            if (typeof baseItem === 'undefined') {
                alt.logWarning(
                    `ItemManager: Tried to lookup ${copyOfData[index].dbName}, but base item does not exist.`,
                );
                return undefined;
            }

            if (splitCount >= copyOfData[index].quantity) {
                return undefined;
            }

            // Create copy of item, set quantity to split count.
            let itemClone = deepCloneObject<StoredItem>(copyOfData[index]);
            itemClone.quantity = splitCount;
            itemClone.slot = openSlot;
            itemClone = InternalFunctions.item.calculateWeight(baseItem, itemClone);

            // Remove quantity from existing item based on split count.
            copyOfData[index].quantity -= splitCount;
            copyOfData[index] = InternalFunctions.item.calculateWeight(baseItem, copyOfData[index]);
            copyOfData.push(itemClone);

            return copyOfData;
        },
        /**
         * Combines items from two different slots into a single slot.
         * It's like a stack method.
         *
         * @param {number} fromSlot
         * @param {number} toSlot
         * @param {Array<StoredItem>} data
         * @return {(Array<StoredItem> | undefined)}
         */
        combineAt(fromSlot: number, toSlot: number, data: Array<StoredItem>): Array<StoredItem> | undefined {
            const fromIndex = data.findIndex((x) => x.slot === fromSlot);
            const toIndex = data.findIndex((x) => x.slot === toSlot);

            if (fromIndex === -1 || toIndex === -1) {
                return undefined;
            }

            if (data[fromIndex].dbName !== data[toIndex].dbName) {
                return undefined;
            }

            if (data[fromIndex].version !== data[toIndex].version) {
                return undefined;
            }

            const baseItem = Athena.systems.itemFactory.sync.getBaseItem(data[toIndex].dbName, data[toIndex].version);
            if (typeof baseItem === 'undefined') {
                alt.logWarning(`ItemManager: Tried to lookup ${data[toIndex].dbName}, but base item does not exist.`);
                return undefined;
            }

            if (baseItem.behavior && !baseItem.behavior.canStack) {
                return undefined;
            }

            let copyOfData = deepCloneArray<StoredItem>(data);
            if (copyOfData[toIndex].quantity === baseItem.maxStack) {
                return undefined;
            }

            if (copyOfData[fromIndex].quantity + copyOfData[toIndex].quantity <= baseItem.maxStack) {
                copyOfData[toIndex].quantity += copyOfData[fromIndex].quantity;
                copyOfData[toIndex] = InternalFunctions.item.calculateWeight(baseItem, copyOfData[toIndex]);
                copyOfData.splice(fromIndex, 1);
                return copyOfData;
            }

            const spaceAvailable = baseItem.maxStack - copyOfData[toIndex].quantity;
            copyOfData[fromIndex].quantity -= spaceAvailable;
            copyOfData[toIndex].quantity += spaceAvailable;

            copyOfData[fromIndex] = InternalFunctions.item.calculateWeight(baseItem, copyOfData[fromIndex]);
            copyOfData[toIndex] = InternalFunctions.item.calculateWeight(baseItem, copyOfData[toIndex]);

            return copyOfData;
        },
        combineAtComplex(from: ComplexSwap, to: ComplexSwap): ComplexSwapReturn | undefined {
            if (typeof from.size === 'string') {
                from.size = DEFAULT_CONFIG[from.size].size;
            }

            if (typeof to.size === 'string') {
                to.size = DEFAULT_CONFIG[to.size].size;
            }

            const fromIndex = from.data.findIndex((x) => x.slot === from.slot);
            const toIndex = to.data.findIndex((x) => x.slot === to.slot);

            if (fromIndex <= -1) {
                return undefined;
            }

            const fromData = deepCloneArray<StoredItem>(from.data);
            const toData = deepCloneArray<StoredItem>(to.data);

            const baseItem = ItemFactory.sync.getBaseItem(fromData[fromIndex].dbName, fromData[fromIndex].version);
            if (typeof baseItem === 'undefined') {
                return undefined;
            }

            if (baseItem.behavior && !baseItem.behavior.canStack) {
                return undefined;
            }

            const maxStackSize = typeof baseItem.maxStack === 'number' ? baseItem.maxStack : Number.MAX_SAFE_INTEGER;
            const spaceAvailable = maxStackSize - toData[toIndex].quantity;

            if (spaceAvailable <= 0) {
                return undefined;
            }

            // Quantity being moved, smaller than max stack but also enough room for whole stack.
            // Simply move quantities; and return results.
            if (spaceAvailable > fromData[fromIndex].quantity) {
                toData[toIndex].quantity += fromData[fromIndex].quantity;
                toData[toIndex] = InternalFunctions.item.calculateWeight(baseItem, toData[toIndex]);
                fromData.splice(fromIndex, 1);
                return { from: fromData, to: toData };
            }

            fromData[fromIndex].quantity -= spaceAvailable;
            toData[toIndex].quantity += spaceAvailable;

            fromData[fromIndex] = InternalFunctions.item.calculateWeight(baseItem, fromData[fromIndex]);
            toData[toIndex] = InternalFunctions.item.calculateWeight(baseItem, toData[toIndex]);

            return { from: fromData, to: toData };
        },
        /**
         * Swaps slots between a single data set.
         *
         * @param {number} fromSlot
         * @param {number} toSlot
         * @param {Array<StoredItem>} data
         * @param {}
         * @return {(Array<StoredItem> | undefined)}
         */
        swap(
            fromSlot: number,
            toSlot: number,
            data: Array<StoredItem>,
            dataSize: InventoryType | number = DEFAULT_CONFIG.custom.size,
        ): Array<StoredItem> | undefined {
            const startIndex = data.findIndex((x) => x.slot === fromSlot);
            const endIndex = data.findIndex((x) => x.slot === toSlot);

            // Force data set sizing based on configuration.
            if (typeof dataSize === 'string') {
                dataSize = DEFAULT_CONFIG[dataSize].size;
            }

            if (toSlot > dataSize) {
                return undefined;
            }

            if (startIndex <= -1) {
                return undefined;
            }

            if (startIndex === endIndex) {
                return undefined;
            }

            // Simply swap the slots.
            let copyOfData = deepCloneArray<StoredItem>(data);
            copyOfData[startIndex].slot = toSlot;

            if (endIndex !== -1) {
                copyOfData[endIndex].slot = fromSlot;
            }

            return copyOfData;
        },
        /**
         * Swap items between two different data sets; with a given size.
         *
         * @param {ComplexSwap} from
         * @param {ComplexSwap} to
         * @return {(ComplexSwapReturn | undefined)}
         */
        swapBetween(from: ComplexSwap, to: ComplexSwap): ComplexSwapReturn | undefined {
            if (typeof from.size === 'string') {
                from.size = DEFAULT_CONFIG[from.size].size;
            }

            if (typeof to.size === 'string') {
                to.size = DEFAULT_CONFIG[to.size].size;
            }

            const fromIndex = from.data.findIndex((x) => x.slot === from.slot);
            const toIndex = to.data.findIndex((x) => x.slot === to.slot);

            if (fromIndex <= -1) {
                return undefined;
            }

            if (to.slot > to.size) {
                return undefined;
            }

            let fromData = deepCloneArray<StoredItem>(from.data);
            let toData = deepCloneArray<StoredItem>(to.data);

            // Clone of the original items, if the item is available.
            let fromItem = deepCloneObject<StoredItem>(fromData[fromIndex]);
            const fromBaseItem = ItemFactory.sync.getBaseItem(fromItem.dbName, fromItem.version);
            if (to.type === 'toolbar' && fromBaseItem && fromBaseItem.behavior && !fromBaseItem.behavior.isToolbar) {
                return undefined;
            }

            let toItem: StoredItem;
            if (toIndex !== -1) {
                toItem = deepCloneObject<StoredItem>(toData[toIndex]);
                const toBaseItem = ItemFactory.sync.getBaseItem(toItem.dbName, toItem.version);
                if (from.type === 'toolbar' && toBaseItem && toBaseItem.behavior && !toBaseItem.behavior.isToolbar) {
                    return undefined;
                }

                toItem.slot = from.slot;
                toData.splice(toIndex, 1);

                // Move the 'to' item to the other data set.
                fromData.push(toItem);
            }

            fromData.splice(fromIndex, 1);
            fromItem.slot = to.slot;

            // Move the 'from' item to the other data set.
            toData.push(fromItem);
            return { from: fromData, to: toData };
        },
    },
    utility: {
        /**
         * Invokes an item use effect
         *
         * @param {alt.Player} player
         * @param {number} slot
         * @param {('inventory' | 'toolbar')} [type='toolbar']
         * @return {*}
         */
        useItem(player: alt.Player, slot: number, type: 'inventory' | 'toolbar' = 'toolbar') {
            if (!player || !player.valid) {
                return;
            }

            if (typeof slot !== 'number') {
                return;
            }

            const data = Athena.document.character.get(player);
            if (typeof data[type] === 'undefined') {
                return;
            }

            const storedItem = Athena.systems.itemManager.slot.getAt(slot, data[type]);
            if (typeof storedItem === 'undefined') {
                return;
            }

            console.log(storedItem);

            const baseItem = Athena.systems.itemFactory.sync.getBaseItem(storedItem.dbName, storedItem.version);
            if (typeof baseItem === 'undefined') {
                console.log('base item failure');
                return;
            }

            if (baseItem.behavior && baseItem.behavior.isWeapon) {
                console.log('is weapon');
            }

            if (baseItem.behavior && baseItem.behavior.isClothing) {
                console.log('toggling...');
                Athena.systems.itemClothing.toggleItem(player, slot);
                return;
            }

            if (!baseItem.consumableEventToCall) {
                return;
            }

            Athena.systems.effects.invoke(player, slot, type);
        },
        /**
         * Compare two items to check if they are the same version.
         *
         * @param {StoredItem} firstItem
         * @param {StoredItem} secondItem
         * @return {boolean}
         */
        compare(firstItem: StoredItem, secondItem: StoredItem): boolean {
            const firstUndefined = typeof firstItem === 'undefined';
            const secUndefined = typeof secondItem === 'undefined';

            if (firstUndefined && secUndefined) {
                return false;
            }

            if (!firstUndefined && secUndefined) {
                return false;
            }

            if (firstUndefined && !secUndefined) {
                return false;
            }

            if (firstItem.dbName !== secondItem.dbName) {
                return false;
            }

            return firstItem.version === secondItem.version;
        },
    },
};
