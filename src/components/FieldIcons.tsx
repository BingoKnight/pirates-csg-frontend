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

export function BaseMoveImage(props) {
    return <img
        src={baseMoveSvg}
        alt='Base Move'
        {...defaultProps}
        {...props}
    />
}

export function CannonsImage(props) {
    return <img
        src={cannonsSvg}
        alt='Cannons'
        {...defaultProps}
        {...props}
    />
}

export function CargoImage(props) {
    return <img
        src={cargoSvg}
        alt='Cargo'
        {...defaultProps}
        {...props}
    />
}

export function MastsImage(props) {
    return <img
        src={mastsSvg}
        alt='Masts'
        {...defaultProps}
        {...props}
    />
}

export function LinkImage(props) {
    const { height, ...linkImageProps } = defaultProps
    return <img
        src={linkSvg}
        alt='Link'
        {...linkImageProps}
        height="35px"
        {...props}
    />
}

export function RarityImage(props) {
    return <img
        src={raritySvg}
        alt='Rarity'
        {...defaultProps}
        {...props}
    />
}

export function FactionImage(props) {
    return <img
        src={factionSvg}
        alt='Faction'
        {...defaultProps}
        {...props}
    />
}

