import React, { useState } from 'react'

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
    const [isCreatingAccount, setIsCreatingAccount] = useState(false)

    function createAccount() {
        setIsCreatingAccount(true)
        console.log('Creating account...')
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
                                <TextInput id="email-input" label="Email" />
                            </div>
                        </div>
                        <div className="row username-password-row">
                            <div className="col username-input-col">
                                <TextInput id="username-input" label="Username" />
                            </div>
                            <div className="col password-input-col">
                                <PasswordInput id="password-input" label="Password"/>
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

