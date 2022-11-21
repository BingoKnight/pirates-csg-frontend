import React from 'react'

interface CheckboxProps {
    label: string
    id: string
    onChange?: Function
}

function Checkbox(props: CheckboxProps) {
    const { label, ...inputProps } = props

    return (
        <div>
            {label} <input type='checkbox' {...inputProps} />
        </div>
    )
}

export default Checkbox
