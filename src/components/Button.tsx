import React, {MouseEventHandler} from 'react'

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
        <div className="form-button disabled">
            <button id={id} style={{ width, height }} onClick={onClick} {...buttonProps}>{label}</button>
        </div>
    )
}
