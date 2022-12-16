import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

import { ReactComponent as EyeIcon } from '../images/eye-regular.svg'
import { ReactComponent as EyeSlashIcon } from '../images/eye-slash-regular.svg'

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
        setText(value.trim())
        if(onChange)
            onChange(value.trim())
    }

    function handleOnEnter(e: KeyboardEvent<HTMLInputElement>) {
        if (onEnter && e.key === 'Enter') {
            const value = parseInt((e.target as HTMLInputElement).value)
            onEnter(value)
        }
    }

    useEffect(() => {
        if (ref && ref.current.value !== text)
            setText(ref.current.value)
    }, [ref?.current?.value])

	return (
        <div className={className ? 'form-input ' + className : 'form-input'}>
            <input
                type={'text'}
                id={id}
                className={text ? 'active' : ''}
                ref={ref}
                onChange={handleChange}
                onBlur={e => e.target.value = e.target.value.trim()}
                onKeyDown={handleOnEnter}
                defaultValue={defaultValue}
                spellcheck={disableSpellCheck ? 'false' : ''}
                {...textInputProps}
            />
			<label htmlFor={id} className={text ? 'active' : null}>{label}</label>
		</div>
	)
})

export const PasswordInput = React.forwardRef((props: TextInputProps, ref) => {
    const {
        id,
        className,
        label,
        defaultValue,
        disableSpellCheck,
        onChange,
        onEnter,
        ...passwordInputProps
    } = props
    const [password, setPassword] = useState(defaultValue || '');
    const [isPasswordVisible, togglePasswordVisible] = useState(false)

    function handlePasswordVisibilityClick() {
        togglePasswordVisible(!isPasswordVisible)
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setPassword(value.trim())
        if(onChange)
            onChange(value.trim())
    }

    function handleOnEnter(e: KeyboardEvent<HTMLInputElement>) {
        if (onEnter && e.key === 'Enter') {
            const value = parseInt((e.target as HTMLInputElement).value)
            onEnter(value)
        }
    }

    useEffect(() => {
        if (ref && ref.current.value !== password)
            setPassword(ref.current.value)
    }, [ref?.current?.value])

	return (
        <div className={className ? 'form-input ' + className : 'form-input'}>
            <input
                type={isPasswordVisible ? 'text' : 'password'}
                id={id}
                className={password ? 'password-input active' : 'password-input'}
                ref={ref}
                onChange={handleChange}
                onBlur={e => e.target.value = e.target.value.trim()}
                onKeyDown={handleOnEnter}
                defaultValue={defaultValue}
                {...passwordInputProps}
            />
			<label htmlFor={id} className={password ? 'active' : null}>{label}</label>
            {
                 isPasswordVisible ?
                 <EyeSlashIcon className='eye-icon' onClick={handlePasswordVisibilityClick}/>
                 : <EyeIcon className='eye-icon' onClick={handlePasswordVisibilityClick}/>
             }
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
        if (onEnter && e.key === 'Enter') {
            const value = parseInt((e.target as HTMLInputElement).value)
            onEnter(value)
        }
    }

    useEffect(() => {
        if (ref && ref.current.value !== value)
            setValue(ref.current.value)
    }, [ref?.current?.value])

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

