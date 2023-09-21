import * as alt from 'alt-client';
import * as native from 'natives'
import * as Athena from '@AthenaClient/api';

alt.onServer("freeze-player", (bool) => {
    alt.log(`Freezing player: ${bool}`)
    native.freezeEntityPosition(alt.Player.local, bool)

})
