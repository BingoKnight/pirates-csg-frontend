import React from 'react'

import  baseMoveSvg  from '../images/field-icons/baseMove.svg'
import cannonsSvg from '../images/field-icons/cannons.svg'
import cargoSvg from '../images/field-icons/cargo.svg'
import mastsSvg from '../images/field-icons/masts.svg'
import linkSvg from '../images/field-icons/link.svg'
import raritySvg from '../images/field-icons/rarity.svg'
import factionSvg from '../images/field-icons/faction.svg'
import pointCostSvg from '../images/field-icons/point-cost.svg'

const defaultProps = {
    draggable: false
}

export function BaseMoveImage(props) {
    return <img
        src={baseMoveSvg}
        alt='Base Move'
        className='field-icon'
        {...defaultProps}
        {...props}
    />
}

export function CannonsImage(props) {
    return <img
        src={cannonsSvg}
        alt='Cannons'
        className='field-icon'
        {...defaultProps}
        {...props}
    />
}

export function CargoImage(props) {
    return <img
        src={cargoSvg}
        alt='Cargo'
        className='field-icon'
        {...defaultProps}
        {...props}
    />
}

export function MastsImage(props) {
    return <img
        src={mastsSvg}
        alt='Masts'
        className='field-icon'
        {...defaultProps}
        {...props}
    />
}

export function LinkImage(props) {
    const { height, ...linkImageProps } = defaultProps
    return <img
        src={linkSvg}
        alt='Link'
        className='field-icon link-icon'
        {...linkImageProps}
        {...props}
    />
}

export function RarityImage(props) {
    return <img
        src={raritySvg}
        alt='Rarity'
        className='field-icon'
        {...defaultProps}
        {...props}
    />
}

export function FactionImage(props) {
    return <img
        src={factionSvg}
        alt='Faction'
        className='field-icon'
        {...defaultProps}
        {...props}
    />
}

export function PointCostImage(props) {
    return <img
        src={pointCostSvg}
        alt='Point Cost'
        className='field-icon'
        {...defaultProps}
        {...props}
    />
}

