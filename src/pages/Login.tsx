import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginUser } from '../api.js'
import Layout from '../components/Layout.tsx'
import Loading from '../components/Loading.tsx'
import { TextInput, PasswordInput } from '../components/TextInput.tsx'
import Button, { LinkButton } from '../components/Button.tsx'

import '../styles/login.scss'

function RegistrationLoadingOverlay() {
    return (
        <div className="registration-overlay">
            <Loading />
            <div className="empty-row"></div>
        </div>
    )
}

// TODO: if logged in redirect to previous page
function Login() {
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
    const [validationError, setValidationError] = useState<string | null>(null)

    const navigate = useNavigate()

    const usernameRef = useRef(null)
    const passwordRef = useRef(null)

    // TODO: validate fields aren't empty
    function login() {
        setIsLoggingIn(true)
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }
        loginUser(user)
            .then(res => {
                if (res.ok) {
                    // TODO: try to check history to route back if it doesn't take user away from
                    // page
                    navigate('/')
                } else {
                    setValidationError('error')
                }
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoggingIn(false))
    }

    return (
        <Layout>
            { isLoggingIn && <RegistrationLoadingOverlay /> }
            <div className="row login-container">
                <div className="col">
                    <div className="row">
                        <TextInput
                            ref={usernameRef}
                            onEnter={login}
                            id="username-input"
                            label="Username"
                            className="username-login-input"
                        />
                    </div>
                    <div className="row">
                        <PasswordInput
                            ref={passwordRef}
                            onEnter={login}
                            id="password-input"
                            label="Password"
                            className="password-login-input"
                        />
                    </div>
                    <div className="row"><Button id="login-button" onClick={login}>Login</Button></div>
                    <div className="row"><LinkButton id="register-button" to="/register">Register</LinkButton></div>
                    <div className="row forgot-links-row">
                        <LinkButton className="forgot-link">Forgot Username?</LinkButton>
                        <LinkButton className="forgot-link">Forgot Password?</LinkButton>
                    </div>
                </div>
            </div>
        </Layout>
    ) 
}

export default Login;

