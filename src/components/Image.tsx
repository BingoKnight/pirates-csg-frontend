import React from 'react'

function Image(props) {
    const { src, alt, ...imgProps } = props

    const defaultProps = {
        height: '25px',
        draggable: false
    }
    return <img
        src={src}
        alt={alt}
        {...defaultProps}
        {...imgProps}
    />
}

export default Image

