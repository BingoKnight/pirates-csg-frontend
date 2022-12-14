import React, { useRef, useState } from 'react'

import { registerUser } from '../api'
import Layout from '../components/Layout.tsx'
import { ValidationErrors, LoadingOverlay } from '../components/LoginRegistration.tsx'
import { TextInput, PasswordInput } from '../components/TextInput.tsx'
import Button from '../components/Button.tsx'
import { useStatefulNavigate } from '../utils/hooks.ts'

import '../styles/registration.scss'

// TODO: if logged in redirect to previous page
// TODO: add feedback after successful registration then ask user to click something to acknowledge
// and maybe take to home page
function Registration() {
    const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])

    const navigate = useStatefulNavigate()

    const emailRef = useRef(null)
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)

    function createAccount() {
        setIsCreatingAccount(true)
        const user = {
            email: emailRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }
        registerUser(user)
            .then(async res => {
                if (res.ok) {
                    setValidationErrors([])
                    navigate('/', true)
                } else {
                    const body = await res.json()
                    const errorMessages = body.details?.body.map(error => error.message) || [body.error]
                    console.log(errorMessages)
                    setValidationErrors(errorMessages)
                }
            })
            .catch(err => console.log(err))
            .finally(() => setIsCreatingAccount(false))
    }

    function closeValidationErrors(errorIndex) {
        setValidationErrors(validationErrors.filter((_, index) => index !== errorIndex))
    }

    return (
        <Layout>
            { isCreatingAccount && <LoadingOverlay /> }
            <div className="registration-container">
                <div className="row registration-header">
                    <div className="col">
                        Create an account
                    </div>
                </div>
                <div className="row">
                    {
                        validationErrors.length > 0
                        && <ValidationErrors
                            validationErrors={validationErrors}
                            closeHandler={closeValidationErrors}
                        />
                    }
                </div>
                <div className="row registration-content">
                    <div className="col">
                        <div className="row">
                            <div className="col email-input-col">
                                <TextInput
                                    ref={emailRef}
                                    id="email-input"
                                    label="Email"
                                    onEnter={createAccount}
                                />
                            </div>
                        </div>
                        <div className="row username-password-row">
                            <div className="col username-input-col">
                                <TextInput
                                    ref={usernameRef}
                                    id="username-input"
                                    label="Username"
                                    onEnter={createAccount}
                                />
                            </div>
                            <div className="col password-input-col">
                                <PasswordInput
                                    ref={passwordRef}
                                    id="password-input"
                                    label="Password"
                                    onEnter={createAccount}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <Button id="register-button" onClick={createAccount}>Create Account</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    ) 
}

export default Registration;

