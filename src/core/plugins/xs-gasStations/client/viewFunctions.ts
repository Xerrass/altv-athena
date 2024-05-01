import * as alt from 'alt-client';
import * as native from 'natives'
import * as AthenaClient from '@AthenaClient/api';
import ViewModel from '@AthenaClient/models/viewModel';
import { IGasStation } from '../shared/interfaces/IGasStation';
import { XS_GAS_STATION_EVENTS } from '../shared/enum/GasStationEvents';


const ComponentName = 'XSGS';
let gasStation: IGasStation;

class InternalFunctionsGS implements ViewModel {

    static async show(_gasStation: IGasStation): Promise<void> {
        gasStation = _gasStation


        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        AthenaClient.webview.ready(ComponentName, InternalFunctionsGS.ready);
        //AthenaClient.webview.on(XS.VIEW_TELEPORT, InternalFunctions.teleport)

        AthenaClient.webview.openPages(ComponentName, true, InternalFunctionsGS.close);
        AthenaClient.webview.focus();
        AthenaClient.webview.setOverlaysVisible(false)

        AthenaClient.webview.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close(invokeClosePage = false) {
        alt.toggleGameControls(true);

        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);
        AthenaClient.webview.setOverlaysVisible(true)

        alt.Player.local.isMenuOpen = false;

        if (invokeClosePage) {
            AthenaClient.webview.closePages([ComponentName]);
        }
    }

    static async ready() {
        AthenaClient.webview.emit(XS_GAS_STATION_EVENTS.VIEW_SET_GS, gasStation)
    }


}

alt.onServer(XS_GAS_STATION_EVENTS.VIEW_OPEN_GS, InternalFunctionsGS.show);
alt.onServer(XS_GAS_STATION_EVENTS.VIEW_CLOSE_GS, InternalFunctionsGS.close);

