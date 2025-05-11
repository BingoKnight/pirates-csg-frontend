import React from 'react'
import Layout from '../components/Layout.tsx'
import '../styles/home.scss'

function Maintenance() {
    return (
        <Layout>
            <div className='maintenance-container'>
                This website is under maintenance until Monday, May 19th 2025.
                I apologize for the inconvenience.
            </div>
        </Layout>
    )
}

export default Maintenance;

