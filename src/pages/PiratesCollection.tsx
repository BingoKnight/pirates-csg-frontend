import {Outlet} from 'react-router-dom'

import Layout from  '../components/Layout.tsx'

import { getUserCollection } from '../api.js'
import PiratesCsgSearch from '../components/PiratesCsgSearch.tsx'

function PiratesCollection() {
    return (
        <Layout>
            <Outlet />
            <PiratesCsgSearch
                getPiratesCsgList={getUserCollection}
                sessionStoragePiratesCsgListKey="userCollection"
            />
        </Layout>
    )
}

export default PiratesCollection
