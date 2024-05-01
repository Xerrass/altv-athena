import * as alt from 'alt-client';
import * as native from 'natives'
import * as AthenaClient from '@AthenaClient/api';
import ViewModel from '@AthenaClient/models/viewModel';
import { HOUSING_INTERACTIONS } from '../shared/enums/events';
import { Static } from 'vue';
import { IAppartment } from '../shared/interfaces/IAppartment';
import { InteriorFunctions } from './InteriorFunctions';
import { sendNotification, clearAll } from '@AthenaPlugins/fnky-notifcations/client';


alt.onServer("requestInterior", InteriorFunctions.requestInterior)
alt.onServer("removeInterior", InteriorFunctions.removeInterior)
alt.onServer("requestIPL", InteriorFunctions.requestIPL)
alt.onServer("removeIPL", InteriorFunctions.removeIPL)

const PAGE_NAME = "Housing";
let appartment: IAppartment;

class InternalFunctions implements ViewModel {

    static async show(_appartment: IAppartment): Promise<void> {
        appartment = _appartment


        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }
        sendNotification(1, 10, "Debug", `Show page with address ${appartment.address}`)
        // Must always be called first if you want to hide HUD.
        AthenaClient.webview.ready(PAGE_NAME, InternalFunctions.ready);
        AthenaClient.webview.on(HOUSING_INTERACTIONS.ENTER, InternalFunctions.enter)
        AthenaClient.webview.on(HOUSING_INTERACTIONS.TOGGLE_LOCK, InternalFunctions.toggleLock)

        AthenaClient.webview.openPages(PAGE_NAME, true, InternalFunctions.close);
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
            AthenaClient.webview.closePages([PAGE_NAME]);
        }
    }

    static async ready() {
        AthenaClient.webview.emit(HOUSING_INTERACTIONS.VIEW_SETAPPARTMENT, appartment)
    }

    static async enter() {
        alt.emitServer(HOUSING_INTERACTIONS.ENTER, appartment)
        alt.toggleGameControls(true);

        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);
        AthenaClient.webview.setOverlaysVisible(true)

        alt.Player.local.isMenuOpen = false;


        AthenaClient.webview.closePages([PAGE_NAME]);

    }

    static async toggleLock() {
        appartment.door_locked = !appartment.door_locked
        sendNotification(1, 10, "Debug", `Lock State ${appartment.door_locked}`)
        AthenaClient.webview.emit(HOUSING_INTERACTIONS.VIEW_SETAPPARTMENT, appartment)
    }
}

alt.onServer(HOUSING_INTERACTIONS.VIEW_OPEN, InternalFunctions.show);
alt.onServer(HOUSING_INTERACTIONS.VIEW_CLOSE, InternalFunctions.close);

