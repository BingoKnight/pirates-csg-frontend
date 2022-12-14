import React, { MouseEventHandler, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

import '../styles/button.scss'

interface ButtonProps {
    id: string
    label: any
    onClick: MouseEventHandler
    children: ReactNode
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
    const location = useLocation()

    return (
        <div className="form-button">
            <Link id={id} to={to} state={{ from: location.pathname }} onClick={onClick} {...buttonProps}>{children}</Link>
        </div>
    )
}

