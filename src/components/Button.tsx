import React, {MouseEventHandler} from 'react'
import { Link } from 'react-router-dom'

import '../styles/button.scss'

interface ButtonProps {
    id: string
    label: any
    onClick: MouseEventHandler
    width?: string
    height?: string
}

interface LinkButtonProps extends ButtonProps {
    to: string
}

export default function Button(props: ButtonProps) {
    const { id, onClick, children, ...buttonProps } = props

    return (
        <div className="form-button">
            <button id={id} onClick={onClick} {...buttonProps}>{children}</button>
        </div>
    )
}

export function LinkButton(props: LinkButtonProps) {
    const { id, to, onClick, children, ...buttonProps } = props

    return (
        <div className="form-button">
            <Link id={id} to={to} onClick={onClick} {...buttonProps}>{children}</Link>
        </div>
    )
}
