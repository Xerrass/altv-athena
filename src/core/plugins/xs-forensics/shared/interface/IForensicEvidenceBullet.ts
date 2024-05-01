import * as alt from 'alt-shared';
import { IForensicEvidence } from './IForensicEvidence';

export interface IForensicEvidenceBullet extends IForensicEvidence {

}

export interface IForensicEvidenceBulletCasing extends IForensicEvidence {
    pos: alt.IVector3
}