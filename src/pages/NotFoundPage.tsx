import React from 'react'
import {Link} from 'react-router-dom'

import Image from '../components/Image.tsx'
import Layout from '../components/Layout.tsx'

import ConfusedGif from '../images/jack-sparrow-confused.gif'

import '../styles/notFoundPage.scss'

function NotFoundPage() {
    return (
        <Layout>
            <div className="not-found-text">Uh oh, this page doesn't exist</div>
            <div className="confused-gif">
                <Image src={ConfusedGif} height="250px"/>
            </div>
            <Link to="/" className='go-home-link'>Click here to go home</Link>
        </Layout>
    )
}

export default NotFoundPage

