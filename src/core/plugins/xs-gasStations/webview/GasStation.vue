<template>
    <div class="outer" v-if="display">
        <div class="inner">
            <div class="GasStatioon">
                <div class="header">
                    {{ gasStation.displayName }}
                </div>
                <div class="spots">
                    <div class="spot" v-for="fuelType in gasStation.aviableFuel">
                        <div class="spot-inner" @click="">
                            {{ fuelType }}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import WebViewEvents from '@ViewUtility/webViewEvents';
import { ref, onMounted } from 'vue';
import { IGasStation } from '../shared/interfaces/IGasStation';
import { XS_GAS_STATION_EVENTS } from '../shared/enum/GasStationEvents';
import { Owner_RonOil } from '../server/GasStationOwners/ronOil';
import { FUEL_TYPE } from '@AthenaShared/enums/vehicleTypeFlags';


const ComponentName = 'XSGS';

let gasStation = ref({} as IGasStation)
let display = ref(true);

function setGasStation(_gasStation: IGasStation) {
    gasStation.value = _gasStation;
}


onMounted(() => {
    if ('alt' in window) {
        WebViewEvents.on(XS_GAS_STATION_EVENTS.VIEW_SET_GS, setGasStation)
        WebViewEvents.emitReady(ComponentName);
    } else {
        gasStation.value = {
            displayName: "EastSide Firestation Tankstelle",
            blip: { color: 53, pos: { x: 1208, y: -1403, z: 34 }, scale: 0.8, shortRange: true, text: "Tankstelle", sprite: 361 },
            fuelSpots: [
                { x: 1209.679, y: -1406.459, z: 35.385 }
            ],
            owner: Owner_RonOil,
            aviableFuel: [FUEL_TYPE.DIESEL, FUEL_TYPE.GAS, FUEL_TYPE.ELECTRIC]
        }
    }
})
</script>

<style scoped>
.outer {
    width: 100%;
    color: black;

}

.inner {
    float: right;
}

.GasStatioon {
    color: red;
    width: 400px;
    position: absolute;
    right: 0px;
    margin-right: 20px;
    margin-bottom: 60px;
    text-align: center;
    margin: 10px;
    border: 2px;
    border-color: black;
    border-radius: 2px;
    border-style: double;
    background-color: 10;
}

.header {
    color: red;
}
</style>