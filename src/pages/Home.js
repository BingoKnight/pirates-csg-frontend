import React from 'react'
import { Outlet } from 'react-router-dom'

import { getPiratesCsgList } from '../api';
import Layout from '../components/Layout.tsx'
import PiratesCsgSearch from '../components/PiratesCsgSearch.tsx'

import '../styles/home.scss';

function Home() {
    return (
    <Layout>
        <Outlet />
        <PiratesCsgSearch
            getPiratesCsgList={getPiratesCsgList}
            sessionStoragePiratesCsgListKey="piratesCsgList"
        />
    </Layout>
    ) 
}

export default Home;

