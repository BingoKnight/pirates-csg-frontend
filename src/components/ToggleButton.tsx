import React, { useState } from 'react'
import '../styles/toggleButton.scss'

interface ButtonProps {
    id: string
    label: string
    onClick: (toggleStatus: boolean) => void
    className: string
    width?: string
    height?: string
}

export default function ToggleButton(props: ButtonProps) {
    const { id, label, onClick, className, ...buttonProps } = props
    const [isToggled, setIsToggled] = useState(false)

    function handleClick() {
        onClick(!isToggled)
        setIsToggled(!isToggled)
    }

    return (
        <button
            id={id}
            className={`${className} toggle-button${isToggled ? ' toggled' : ''}`}
            onClick={handleClick}
            {...buttonProps}
        >
            {label}
        </button>
    )
}

