import React from 'react'
import ReactSlider from 'react-slider'

import '../styles/slider.scss'

function Slider(props) {
    return <ReactSlider
        className='slider'
        thumbClassName='slider-thumb'
        trackClassName='slider-track'
        {...props}
    />
}

export default Slider

