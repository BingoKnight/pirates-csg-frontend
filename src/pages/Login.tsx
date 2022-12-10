import React from 'react'

import Layout from '../components/Layout.tsx'
import { TextInput, PasswordInput } from '../components/TextInput.tsx'
import Button, { LinkButton } from '../components/Button.tsx'

import '../styles/login.scss'

// TODO: if logged in redirect to previous page
function Login() {
    return (
        <Layout>
            <div className="row login-container">
                <div className="col">
                    <div className="row"><TextInput id="username-input" label="Username" className="username-login-input" /></div>
                    <div className="row"><PasswordInput id="password-input" label="Password" className="password-login-input" /></div>
                    <div className="row"><Button id="login-button">Login</Button></div>
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

