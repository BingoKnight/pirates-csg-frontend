import React, {MouseEventHandler} from 'react'

import '../styles/button.scss'

interface ButtonProps {
    id: string
    label: any
    onClick: MouseEventHandler
    width?: string
    height?: string
}

export default function Button(props: ButtonProps) {
    const { id, label, onClick, width = '125px', height = '40px', ...buttonProps } = props

    return (
        <div className="form-button">
            <button id={id} style={{ width, height }} onClick={onClick} {...buttonProps}>{label}</button>
        </div>
    )
}
