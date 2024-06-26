import { RadioType } from './Enum/SaltyChat/RadioType.js';
export class Config {
    static radioRange = RadioType.longRange;
    static enableRadioAnimation = true;
    static enableLipSync = true;
    static enableMuffling = true;
    static enableSignalStrength = true;
    static enableRadioSound = true;
    static enableOverlay = true;
    static overlayLanguage = 'en';
    static overlayAddress = '<replace!>';
    static automaticPlayerHealth = true;
}
