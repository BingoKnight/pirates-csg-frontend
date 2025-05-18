import React, { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { registerUser } from '../api'
import Layout from '../components/Layout.tsx'
import { LoadingOverlay } from '../components/LoginRegistration.tsx'
import { TextInput, PasswordInput } from '../components/TextInput.tsx'
import Button from '../components/Button.tsx'
import { useStatefulNavigate } from '../utils/hooks.ts'

import '../styles/registration.scss'

function Registration() {
    const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false)
    const location = useLocation()
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
            .then(() => {
                const { from } = ['/login', '/register'].includes(location.state?.from) ? { from: '/' } : location.state || { from: '/' }
                navigate(from, true)
            })
            .catch(console.log)
            .finally(() => setIsCreatingAccount(false))
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

export default Registration

