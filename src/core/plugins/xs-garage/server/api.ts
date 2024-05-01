import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

async function addGarage() {

}



const GarageFunctions = {
    addGarage
}

Athena.systems.plugins.addAPI('Xs-Garage', GarageFunctions)

declare global {
    export interface ServerPluginAPI {
        ['Xs-Garage']: typeof GarageFunctions
    }
}