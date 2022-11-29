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
    const { id, onClick, children, ...buttonProps } = props

    return (
        <div className="form-button">
            <button id={id} onClick={onClick} {...buttonProps}>{children}</button>
        </div>
    )
}
