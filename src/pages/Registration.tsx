import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { registerUser } from '../api'
import Layout from '../components/Layout.tsx'
import { TextInput, PasswordInput } from '../components/TextInput.tsx'
import Button from '../components/Button.tsx'
import Loading from '../components/Loading.tsx'

import '../styles/registration.scss'

function RegistrationLoadingOverlay() {
    return (
        <div className="registration-overlay">
            <Loading />
            <div className="empty-row"></div>
        </div>
    )
}

// TODO: if logged in redirect to previous page
function Registration() {
    const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false)
    const [validationError, setValidationError] = useState<string | null>(null)

    const navigate = useNavigate()

    const emailRef = useRef(null)
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)

    // TODO: validate fields aren't empty
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
                    navigate('/')
                } else {
                    setValidationError('error')
                }
            })
            .catch(err => console.log(err))
            .finally(() => setIsCreatingAccount(false))
    }

    return (
        <Layout>
            { isCreatingAccount && <RegistrationLoadingOverlay /> }
            <div className="registration-container">
                <div className="row registration-header">
                    <div className="col">
                        Create an account
                    </div>
                </div>
                <div className="row registration-content">
                    <div className="col">
                        <div className="row">
                            <div className="col email-input-col">
                                <TextInput ref={emailRef} id="email-input" label="Email" />
                            </div>
                        </div>
                        <div className="row username-password-row">
                            <div className="col username-input-col">
                                <TextInput ref={usernameRef} id="username-input" label="Username" />
                            </div>
                            <div className="col password-input-col">
                                <PasswordInput ref={passwordRef} id="password-input" label="Password"/>
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

