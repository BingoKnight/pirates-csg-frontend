import React from 'react'
import { Outlet } from 'react-router-dom'

import Layout from '../components/Layout.tsx'
import PiratesCsgSearch from '../components/PiratesCsgSearch.tsx'
import { piratesCsgList$ } from '../services/globalState.ts'

import '../styles/home.scss'

function Home() {
    return (
        <Layout>
            <Outlet />
            <PiratesCsgSearch
                csgListSubscription={piratesCsgList$}
                sessionStoragePiratesCsgListKey="piratesCsgList"
                sessionStorageQueryKey="query"
            />
        </Layout>
    ) 
}

export default Home;

