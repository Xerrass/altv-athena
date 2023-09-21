import * as alt from 'alt-client';
import * as native from 'natives'
import * as Athena from '@AthenaClient/api';

alt.onServer("requestIPL", (ipl: string) => {
    alt.requestIpl(ipl);
    alt.log(`${ipl} requested`);

})
alt.onServer("removeIPL", (ipl: string) => {
    alt.removeIpl(ipl);
    alt.log(`${ipl} removed`);
})
