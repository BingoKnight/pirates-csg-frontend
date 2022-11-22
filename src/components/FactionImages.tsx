import React from 'react'
import americaIcon from '../images/faction-icons/america.png'
import corsairsIcon from '../images/faction-icons/corsairs.png'
import cursedIcon from '../images/faction-icons/cursed.png'
import englandIcon from '../images/faction-icons/england.png'
import franceIcon from '../images/faction-icons/france.png'
import jadeIcon from '../images/faction-icons/jade.png'
import mercenaryIcon from '../images/faction-icons/mercenary.png'
import pirateIcon from '../images/faction-icons/pirate.png'
import spainIcon from '../images/faction-icons/spain.png'
import vikingIcon from '../images/faction-icons/viking.png'
import whiteBeardRaidersIcon from '../images/faction-icons/whitebeardraiders.png'

export function AmericaImage(props) {
    return <img
        className='faction-image'
        src={americaIcon}
        draggable='false'
        alt='American'
        {...props}
    />
}

export function CorsairImage(props) {
    return <img
        className='faction-image'
        src={corsairsIcon}
        draggable='false'
        alt='Barbary Corsair'
        {...props}
    />
}

export function CursedImage(props) {
    return <img
        className='faction-image'
        src={cursedIcon}
        draggable='false'
        alt='Cursed'
        {...props}
    />
}

export function EnglandImage(props) {
    return <img
        className='faction-image'
        src={englandIcon}
        draggable='false'
        alt='English'
        {...props}
    />
}

export function FranceImage(props) {
    return <img
        className='faction-image'
        src={franceIcon}
        draggable='false'
        alt='French'
        {...props}
    />
}

export function JadeImage(props) {
    return <img
        className='faction-image'
        src={jadeIcon}
        draggable='false'
        alt='Jade Rebellion'
        {...props}
    />
}

export function MercenaryImage(props) {
    return <img
        className='faction-image'
        src={mercenaryIcon}
        draggable='false'
        alt='Mercenary'
        {...props}
    />
}

export function PirateImage(props) {
    return <img
        className='faction-image'
        src={pirateIcon}
        draggable='false'
        alt='Pirate'
        {...props}
    />
}

export function SpainImage(props) {
    return <img
        className='faction-image'
        src={spainIcon}
        draggable='false'
        alt='Spanish'
        {...props}
    />
}

export function VikingImage(props) {
    return <img
        className='faction-image'
        src={vikingIcon}
        draggable='false'
        alt='Viking'
        {...props}
    />
}

export function WhiteBeardRaidersImage(props) {
    return <img
        className='faction-image'
        src={whiteBeardRaidersIcon}
        draggable='false'
        alt="Whitebeard's Raiders"
        {...props}
    />
}

