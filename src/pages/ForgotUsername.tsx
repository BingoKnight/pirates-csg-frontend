import React from 'react'

import Button from '../components/Button.tsx'
import Layout from '../components/Layout.tsx'
import { TextInput } from '../components/TextInput.tsx'

import '../styles/forgot-username.scss'

function ForgotUsername() {

    function sendEmail() {
    }

    return (
        <Layout>
            <div className="forgot-username-container">
                <div className="row">
                    <div className='title'>Forgot Username</div>
                </div>
                <div className="row">
                    <div className="subtitle">We can look you up by email and send you your username</div>
                </div>
                <div className="row">
                    <TextInput
                        onEnter={sendEmail}
                        id="email-input"
                        label="Email"
                        className="email-input"
                    />
                </div>
                <div className="row">
                    <Button onClick={sendEmail} className="submit-button" >Submit</Button>
                </div>
            </div>
        </Layout>
    )
}

export default ForgotUsername

