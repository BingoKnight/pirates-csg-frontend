import React, { ChangeEvent, KeyboardEvent, RefObject, useState } from 'react'

import '../styles/textInput.scss'

interface TextInputProps {
    id: string
    className?: string
    label: string
    defaultValue: string
    disableSpellCheck?: boolean
    onChange?: Function
    onEnter?: Function
    ref?: any
}

const TextInput = React.forwardRef((props: TextInputProps, ref) => {
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

export default TextInput
