import React, { useEffect, useRef, useState } from 'react'

import { getUser, updateEmail } from '../api.js'
import Button from '../components/Button.tsx'
import Layout from '../components/Layout.tsx'
import { TextInput, PasswordInput } from '../components/TextInput.tsx'

import '../styles/account-settings.scss'

function AccountSettings() {
    const [currentEmail, setCurrentEmail] = useState(JSON.parse(sessionStorage.getItem('user') || '{}')?.email)
    const emailRef = useRef(null)
    const currentPasswordRef = useRef(null)
    const newPasswordRef = useRef(null)

    function handleEmailUpdate() {
        const email = emailRef?.current?.value.trim()
        updateEmail(email)
            .then(res => {
                if (res.ok) {
                    setCurrentEmail(email)
                    emailRef.current.value = null
                }
            })
    }

    function changePassword() {
        console.log('Change password')
    }

    useEffect(() => {
        async function getCurrentEmail() {
            const user = await (await getUser()).json()
            setCurrentEmail(user.email)
        }

        getCurrentEmail()
    }, [])
    
    // TODO: add loading icon to email container
    return (
        <Layout>
            <div className="account-settings-container">
                <div className='change-email-container'>
                    <div className="row">
                        <div className="col title">
                            Change Email
                        </div>
                    </div>
                    <div className="row subtitle">
                        <div className="col">
                            Update your email here, your email is used to get your password or username in case you forget them.
                        </div>
                    </div>
                    <div className="row">
                        <div className="col current-email-container-col">
                            <div className="current-email-container">
                            <div className="row header">
                                <div className='col'>Current Email</div>
                            </div>
                            <div className="row content">
                                <div className='col'>{currentEmail}</div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col input-field">
                            <TextInput
                                label={'New email'}
                                id={'email-input'}
                                ref={emailRef}
                                onEnter={handleEmailUpdate}
                                disableSpellCheck
                            />
                        </div>
                    </div>
                    <div className="row settings-button-row">
                        <div className="col">
                            <Button className="settings-button" onClick={handleEmailUpdate}>Update Email</Button>
                        </div>
                    </div>
                </div>
                <div className="change-password-container">
                    <div className="row">
                        <div className="col title">
                            Change Password
                        </div>
                    </div>
                    <div className="row">
                        <div className="col input-field">
                            <PasswordInput
                                ref={currentPasswordRef}
                                onEnter={changePassword}
                                id="password-input"
                                label="Current password"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col input-field">
                            <PasswordInput
                                ref={newPasswordRef}
                                onEnter={changePassword}
                                id="password-input"
                                label="New password"
                            />
                        </div>
                    </div>
                    <div className="row settings-button-row">
                        <div className="col">
                            <Button className="settings-button" onClick={changePassword}>Change Password</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AccountSettings

