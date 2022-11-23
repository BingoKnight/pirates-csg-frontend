import React, { useEffect, useState, useRef } from 'react'
import { ReactComponent as DownArrow } from '../images/angle-down-solid.svg'
import { ReactComponent as Checkmark } from '../images/check-solid.svg'

import '../styles/dropdown.scss'

interface DropdownProps {
    label: string
    content: [any]
    onChange: (item: any) => any
    selected?: any
}

function Dropdown(props: DropdownProps) {
    const { label, content, onChange, selected = null } = props

    const [activeItem, setActiveItem] = useState(selected || content[0])
    const [isActive, setIsActive] = useState(false)

    function handleChange(item: any) {
        setIsActive(false)
        setActiveItem(item)
        onChange(item)
    }

    const dropDownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setIsActive(false)
            }
        }

        document.addEventListener('mouseup', handleClickOutside)

        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
        }
    }, [dropDownRef])

    return (
        <div className="row">
            <div className="col">
                <span className="dropdown-label">{label}</span>
            </div>
            <div className="col">
                <div ref={dropDownRef} className={'dropdown noselect' + (isActive ? ' active': '')}>
                    <button className="dropdown-button" onClick={() => setIsActive(!isActive)}>
                        <div className="dropdown-selected">{activeItem}<DownArrow /></div>
                    </button>
                    <ul className="content">
                        <div className="content-backdrop" />
                        {
                            content.map((item: any) => {
                                if (activeItem === item) {
                                    return <li onClick={() => handleChange(item)}>
                                        {item}<Checkmark />
                                    </li>
                                }
                                return <li onClick={() => handleChange(item)}>{item}</li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dropdown

