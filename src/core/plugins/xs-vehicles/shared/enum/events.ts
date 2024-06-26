import * as alt from 'alt-shared'

export enum XVEHICLE_EVENTS {
    GETFUELLEVEL = "x-vehicles:getFuelLevel",
    SETFUELLEVEL = "x-vehicles:setFuelLevel",
    SETMILAGEORUSEHOURS = "x-vehicles:setMilage",
    UPDATEFUELLEVEL = "x-vehicles:updateFuelLevel",
    UPDATEMILAGE = "x-vehicles:updateMilage",
    UPDATEUSEHOURS = "x-vehicles:updateUseHours",
    STARTENGINEINTERVAL = "x-vehicles:startEngineInterval",
    STARTMILAGEINTERVAL = "x-vehicles:startMilageInterval",
    STARTUSAGEINTERVAL = "x-vehicles:startUsageInterval",

}

export enum XVEHICLE_VIEW_EVENTS {
    OPEN = "xs-vehicle:view:open",
    CLOSE = "xs-vehicle:view:close",
    UPDATE = "xs-vehicle:view:update",
}