import * as alt from 'alt-client';
import * as native from 'natives'
import * as AthenaClient from '@AthenaClient/api';
import ViewModel from '@AthenaClient/models/viewModel';

import { ELEVATOR_EVENTS } from '../shared/enum/events';
import { IElevator, IElevatorStop } from '../shared/interfaces/IElevator';
import { sendNotification } from '@AthenaPlugins/fnky-notifcations/client';

const ComponentName = 'Elevator';
let elevator: IElevator;

class InternalFunctions implements ViewModel {

    static async show(_elevator: IElevator): Promise<void> {
        elevator = _elevator


        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        AthenaClient.webview.ready(ComponentName, InternalFunctions.ready);
        AthenaClient.webview.on(ELEVATOR_EVENTS.VIEW_TELEPORT, InternalFunctions.teleport)

        AthenaClient.webview.openPages(ComponentName, true, InternalFunctions.close);
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
        AthenaClient.webview.emit(ELEVATOR_EVENTS.VIEW_SETELEVATOR, elevator)
    }

    static async teleport(spot: IElevatorStop) {
        if (spot.rot) {
            alt.emitServer(ELEVATOR_EVENTS.TELEPORT, spot.pos, spot.rot)

        } else {
            alt.emitServer(ELEVATOR_EVENTS.TELEPORT, spot.pos)

        }
        alt.toggleGameControls(true);

        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);
        AthenaClient.webview.setOverlaysVisible(true)

        alt.Player.local.isMenuOpen = false;


        AthenaClient.webview.closePages([ComponentName]);

    }
}

alt.onServer(ELEVATOR_EVENTS.VIEW_OPEN, InternalFunctions.show);
alt.onServer(ELEVATOR_EVENTS.VIEW_CLOSE, InternalFunctions.close);

