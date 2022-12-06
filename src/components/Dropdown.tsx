import React, { useEffect, useState, useRef } from 'react'
import ToggleButton from './ToggleButton.tsx'
import { ReactComponent as DownArrow } from '../images/angle-down-solid.svg'
import { ReactComponent as Checkmark } from '../images/check-solid.svg'

import '../styles/dropdown.scss'

interface DropdownProps {
    label: string
    content: [any]
    onChange: (item: any) => any
    selected?: any
    width?: string
}

interface MultiItemDropdownProps extends DropdownProps {
    comparisonFunc?: (value: any, option: any) => boolean
    dropdownContentClass?: string
    toggledListClass?: string
}

function Dropdown(props: DropdownProps) {
    const { label, content, onChange, selected = null, width = "50px" } = props

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
                    <button className="dropdown-button" onClick={() => setIsActive(!isActive)} style={{ width }}>
                        <div className="dropdown-selected">{activeItem}<DownArrow /></div>
                    </button>
                    <ul className="content" style={{ width: `calc(${width} - 4px)` }}>
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

function ToggledItemsLabel({ toggledItems, label, className }) {
    if (toggledItems.size === 0) {
        return (
            <span className='dropdown-label'>{label}</span>
        )
    }

    const toggledListClass = className ? `toggled-items-list ${className}` : 'toggled-items-list'

    return (
        <div className={toggledListClass}>
            {[...toggledItems].map(item => <span className="toggled-item">{item}</span>)}
        </div>
    )
}

export function MultiItemDropdown(props: MultiItemDropdownProps) {
    const { label, content, onChange, comparisonFunc, dropdownContentClass = '', toggledListClass = '', selected = [], width = "125px" } = props

    const [toggledItems, setToggledItems] = useState<Set<any>>(new Set(selected))
    const [isActive, setIsActive] = useState(false)

    const dropDownRef = useRef(null)

    const dropdownClass = dropdownContentClass ? `content multi-select-content ${dropdownContentClass}` : `content multi-select-content`
    const dropdownContentStyle = width ? { width: `calc(${width} - 4px)` } : null

    function handleOnChangeBuilder(optionName: string) {
        function handleOnChange(isToggled: boolean) {
            let updatedToggledItems = new Set()

            if (isToggled) {
                updatedToggledItems = new Set([...toggledItems, optionName])

            } else {
                updatedToggledItems = new Set([...toggledItems].filter(value =>
                    comparisonFunc ? !comparisonFunc(value, optionName) : value !== optionName)
                )
            }

            setToggledItems(updatedToggledItems)
            if (onChange) {
                onChange([...updatedToggledItems])
            }
        }

        return handleOnChange
    }

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
                <div ref={dropDownRef} className={'dropdown noselect' + (isActive ? ' active': '')}>
                    <button className="dropdown-button" onClick={() => setIsActive(!isActive)} style={{ width }}>
                        <div className="dropdown-selected">
                            <ToggledItemsLabel className={toggledListClass} toggledItems={toggledItems} label={label} />
                            <span className='down-arrow'><DownArrow /></span>
                        </div>
                    </button>
                    <ul className={dropdownClass} style={dropdownContentStyle}>
                        <div className="content-backdrop" />
                        {
                            content.map((item: any) => {
                                return <li>
                                    <ToggleButton
                                        label={item}
                                        className="dropdown-toggle"
                                        onClick={handleOnChangeBuilder(item)}
                                    />
                                    {
                                        [...toggledItems].some(value => comparisonFunc ? comparisonFunc(value, item) : value === item)
                                        && <Checkmark className="toggled-checkmark"/>
                                    }
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dropdown

