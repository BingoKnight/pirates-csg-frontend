import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { loginUser } from '../api.js'
import Layout from '../components/Layout.tsx'
import { ValidationErrors, LoadingOverlay } from '../components/LoginRegistration.tsx'
import { TextInput, PasswordInput } from '../components/TextInput.tsx'
import Button, { LinkButton } from '../components/Button.tsx'
import { getCookie } from '../utils/cookies.ts'
import { useStatefulNavigate } from '../utils/hooks.ts'

import '../styles/login.scss'

// TODO: if logged in redirect to previous page
// TODO: add forgot password and username once complete in api
function Login() {
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const location = useLocation()
    const navigate = useStatefulNavigate()

    const usernameRef = useRef(null)
    const passwordRef = useRef(null)

    const user = JSON.parse(sessionStorage.getItem('user') || "{}")
    const isLoggedIn = getCookie('x-token') && user.username && user.email

    function login() {
        setIsLoggingIn(true)
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }
        loginUser(user)
            .then(async res => {
                if (res.ok) {
                    // TODO: try to check history to route back if it doesn't take user away from
                    // page
                    setValidationErrors([])
                    const { from } = location.state || { from: '/' }
                    navigate(from)
                } else {
                    const body = await res.json()
                    const errorMessages = body.details?.body.map(error => error.message) || [body.error]
                    console.log(errorMessages)
                    setValidationErrors(errorMessages)
                }
            })
            .catch(console.log)
            .finally(() => setIsLoggingIn(false))
    }

    function closeValidationErrors(errorIndex) {
        setValidationErrors(validationErrors.filter((_, index) => index !== errorIndex))
    }

    useEffect(() => {
        if(isLoggedIn) {
            const { from } = location.state || { from: '/' }
            navigate(from, true)
        }
    }, [])

    return (
        <Layout>
            { isLoggingIn && <LoadingOverlay /> }
            <div className="row login-container">
                <div className="col">
                    <div className="row">
                        {
                            validationErrors.length > 0
                            && <ValidationErrors
                                validationErrors={validationErrors}
                                closeHandler={closeValidationErrors}
                            />
                        }
                    </div>
                    <div className="row">
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
                            {/* <div className="row forgot-links-row">
                                <LinkButton to="/forgot-username" className="forgot-link">Forgot Username?</LinkButton>
                                <LinkButton to="/forgot-password" className="forgot-link">Forgot Password?</LinkButton>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    ) 
}

export default Login;

