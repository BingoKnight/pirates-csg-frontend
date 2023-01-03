import React from 'react'
import { Outlet } from 'react-router-dom'

import Layout from  '../components/Layout.tsx'
import PiratesCsgSearch from '../components/PiratesCsgSearch.tsx'
import { userCollection$ } from '../services/globalState.ts'

function PiratesCollection() {
    return (
        <Layout>
            <Outlet />
            <PiratesCsgSearch
                csgListSubscription={userCollection$}
                sessionStoragePiratesCsgListKey="userCollection"
                sessionStorageQueryKey="collectionQuery"
            />
        </Layout>
    )
}

export default PiratesCollection
