import React from 'react'

import twoS from '../images/cannons/2S.png'
import twoL from '../images/cannons/2L.png'
import threeS from '../images/cannons/3S.png'
import threeL from '../images/cannons/3L.png'
import fourS from '../images/cannons/4S.png'
import fourL from '../images/cannons/4L.png'
import fiveS from '../images/cannons/5S.png'
import fiveL from '../images/cannons/5L.png'
import sixS from '../images/cannons/6S.png'
import sixL from '../images/cannons/6L.png'

export default function CannonImage(props) {
    const { cannon, ...imageProps } = props
    const cannonMap = {
        '2S': twoS,
        '2L': twoL,
        '3S': threeS,
        '3L': threeL,
        '4S': fourS,
        '4L': fourL,
        '5S': fiveS,
        '5L': fiveL,
        '6S': sixS,
        '6L': sixL
    }

    return <img
        src={cannonMap[cannon]}
        alt={cannon}
        width='18px'
        draggable='false'
        {...imageProps}
    />
}

