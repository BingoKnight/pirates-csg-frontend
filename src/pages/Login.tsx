import React, { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { loginUser } from '../api.js'
import Layout from '../components/Layout.tsx'
import { LoadingOverlay } from '../components/LoginRegistration.tsx'
import { TextInput, PasswordInput } from '../components/TextInput.tsx'
import Button, { LinkButton } from '../components/Button.tsx'
import { useStatefulNavigate } from '../utils/hooks.ts'

import '../styles/login.scss'

// TODO: add forgot password and username once complete in api
function Login() {
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
    const location = useLocation()
    const navigate = useStatefulNavigate()

    const usernameRef = useRef(null)
    const passwordRef = useRef(null)

    function login() {
        setIsLoggingIn(true)
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }
        loginUser(user)
            .then(() => {
                const { from } = ['/login', '/register'].includes(location.state?.from) ? { from: '/' } : location.state || { from: '/' }
                navigate(from)
            })
            .catch(console.log)
            .finally(() => setIsLoggingIn(false))
    }

    return (
        <Layout>
            { isLoggingIn && <LoadingOverlay /> }
            <div className="row login-container">
                <div className="col">
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

