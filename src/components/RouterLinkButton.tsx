import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/routerLinkButton.scss'

function RouterLinkButton(props) {
    const { to, className, children, ...buttonProps } = props
    return <Link to={to} className={className ? 'link-button ' + className : 'link-button'} {...buttonProps}>
        {children}
    </Link>
}

export default RouterLinkButton
