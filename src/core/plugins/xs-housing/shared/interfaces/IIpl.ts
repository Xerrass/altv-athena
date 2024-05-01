import * as alt from 'alt-shared'

export interface IIpl {
    iplHash?: string | Array<string>
    interior_props?: Array<InteriorProp>
    interior_pos: alt.IVector3
}

export interface InteriorProp {
    propHash: string
    propColor?: number
}