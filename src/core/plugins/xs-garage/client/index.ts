import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';
import ViewModel from '@AthenaClient/models/viewModel';
import { GARAGE_INTERACTIONS } from '../shared/enum/garageInteractions';

const PAGE_NAME = "Garage";
let vehicles: Partial<OwnedVehicle>[]

class InternalFunctions implements ViewModel {

    static async show(_vehicles: OwnedVehicle[]): Promise<void> {
        vehicles = _vehicles;

        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.

        AthenaClient.webview.openPages(PAGE_NAME, true, InternalFunctions.close);
        AthenaClient.webview.ready(PAGE_NAME, InternalFunctions.ready);
        AthenaClient.webview.focus();
        AthenaClient.webview.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close(invokeClosePage = false) {
        alt.toggleGameControls(true);

        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        if (invokeClosePage) {
            AthenaClient.webview.closePages([PAGE_NAME]);
        }
    }

    static async ready() {
        AthenaClient.webview.emit(GARAGE_INTERACTIONS.SETVEHICLE, vehicles);
    }
}

alt.onServer(GARAGE_INTERACTIONS.OPEN, InternalFunctions.show);
alt.onServer(GARAGE_INTERACTIONS.CLOSE, InternalFunctions.close);
