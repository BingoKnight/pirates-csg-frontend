import React, { ChangeEvent, KeyboardEvent, useState } from 'react'

import '../styles/textInput.scss'

interface InputProps {
    id: string
    className?: string
    label: string
    onChange?: Function
    onEnter?: Function
    ref?: any
}

interface TextInputProps extends InputProps {
    defaultValue?: string
    disableSpellCheck?: boolean
}

interface NumberInputProps extends InputProps {
    defaultValue?: number
    max?: number
    min?: number
}

export const TextInput = React.forwardRef((props: TextInputProps, ref) => {
    const {
        id,
        className,
        label,
        defaultValue,
        disableSpellCheck,
        onChange,
        onEnter,
        ...textInputProps
    } = props
    const [text, setText] = useState(defaultValue || '');

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setText(value)
        if(onChange)
            onChange(value)
    }

    function handleOnEnter(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && onEnter)
            onEnter(e)
    }

	return (
        <div className={className ? 'form-input ' + className : 'form-input'}>
            <input
                type={'text'}
                id={id}
                ref={ref}
                onChange={handleChange}
                onKeyDown={handleOnEnter}
                defaultValue={defaultValue}
                spellcheck={disableSpellCheck ? 'false' : ''}
                {...textInputProps}
            />
			<label htmlFor={id} className={text || defaultValue ? 'active' : null}>{label}</label>
		</div>
	)
})


export const NumberInput = React.forwardRef((props: NumberInputProps, ref) => {
    const {
        id,
        className,
        label,
        min,
        max,
        defaultValue,
        onChange,
        onEnter,
        ...numberInputProps
    } = props
    const [value, setValue] = useState<number | null>(defaultValue || null);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value)
        setValue(value)
        if(onChange)
            onChange(value)
    }

    function handleOnEnter(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && onEnter)
            onEnter(e)
    }

	return (
        <div className={className ? 'form-input ' + className : 'form-input'}>
            <input
                type={'number'}
                id={id}
                ref={ref}
                min={min}
                max={max}
                onChange={handleChange}
                onKeyDown={handleOnEnter}
                defaultValue={defaultValue}
                {...numberInputProps}
            />
			<label htmlFor={id} className={value || value === 0 || defaultValue ? 'active' : null}>{label}</label>
		</div>
	)
})

