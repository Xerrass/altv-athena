import * as alt from 'alt-client';
import * as native from 'natives'
import * as AthenaClient from '@AthenaClient/api';
import ViewModel from '@AthenaClient/models/viewModel';
import { XVEHICLE_VIEW_EVENTS } from '../shared/enum/events';
import { sendNotification } from '@AthenaPlugins/fnky-notifcations/client';


const ComponentName = 'Spedometer';

let vehicle: alt.Vehicle;




export class InternalFunctions implements ViewModel {
    static async open() {


    }



}
//onTicksStart.add(InternalFunctions.init);