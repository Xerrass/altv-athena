import alt from 'alt-client';
import natives from 'natives';

class CayoPerico {
    private readonly _islandCenter = new alt.Vector3(4840.571, -5174.425, 2.0);
    private _nearIsland: boolean = false;
    private _everyTick: number | undefined;

    constructor() {
        alt.setInterval(this.checkRange.bind(this), 2000);
        this.checkRange();
    }

    private checkRange() {
        const distance = alt.Player.local.pos.distanceTo(this._islandCenter);
        const nearIsland = distance <= 2000;
        if (nearIsland == this._nearIsland) return;
        this._nearIsland = nearIsland;

        natives.setIslandEnabled('HeistIsland', nearIsland);
        natives.setScenarioGroupEnabled('Heist_Island_Peds', nearIsland);
        natives.setAudioFlag('PlayerOnDLCHeist4Island', nearIsland);
        natives.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Zones', true, nearIsland);
        natives.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Disabled_Zones', false, nearIsland);
    }
}
alt.setInterval(() => {
    natives.setRadarAsExteriorThisFrame();
    natives.setRadarAsInteriorThisFrame(alt.hash('h4_fake_islandx'), 4700.0, -5145.0, 0, 0);
}, 1);

export default new CayoPerico();
