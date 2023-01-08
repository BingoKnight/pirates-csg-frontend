import React from 'react'
import { Outlet } from 'react-router-dom'

import Layout from '../components/Layout.tsx'
import PiratesCsgSearch from '../components/PiratesCsgSearch.tsx'
import { isCsgListFetchComplete$, piratesCsgList$ } from '../services/globalState.ts'

import '../styles/home.scss'

function Home() {
    return (
        <Layout>
            <Outlet />
            <PiratesCsgSearch
                csgListSubscription={piratesCsgList$}
                isFetchCompleteSubscription={isCsgListFetchComplete$}
                sessionStorageQueryKey="query"
                sessionStoragePageNumberKey="mainPageNumber"
            />
        </Layout>
    ) 
}

export default Home;

