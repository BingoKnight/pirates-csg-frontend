import React from 'react'

import  baseMoveSvg  from '../images/pirate-csg-icons/baseMove.svg'
import cannonsSvg from '../images/pirate-csg-icons/cannons.svg'
import cargoSvg from '../images/pirate-csg-icons/cargo.svg'
import mastsSvg from '../images/pirate-csg-icons/masts.svg'
import linkSvg from '../images/pirate-csg-icons/link.svg'
import raritySvg from '../images/pirate-csg-icons/rarity.svg'
import factionSvg from '../images/pirate-csg-icons/faction.svg'

const defaultProps = {
    height: '25px',
    draggable: false
}

export function BaseMoveImage() {
    return <img src={baseMoveSvg} alt='Base Move' {...defaultProps} />
}

export function CannonsImage() {
    return <img src={cannonsSvg} alt='Cannons' {...defaultProps} />
}

export function CargoImage() {
    return <img src={cargoSvg} alt='Cargo' {...defaultProps} />
}

export function MastsImage() {
    return <img src={mastsSvg} alt='Masts' {...defaultProps} />
}

export function LinkImage() {
    return <img src={linkSvg} alt='Link' {...defaultProps} />
}

export function RarityImage() {
    return <img src={raritySvg} alt='Rarity' {...defaultProps} />
}

export function FactionImage() {
    return <img src={factionSvg} alt='Faction' {...defaultProps} />
}

