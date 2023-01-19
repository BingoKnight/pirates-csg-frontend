import { useObservableState } from 'observable-hooks'
import React from 'react'

import Layout from '../components/Layout.tsx'
import Loading from '../components/Loading.tsx'
import { fleetPagedList$, isFleetPagedListFetchComplete$ } from '../services/globalState.ts'

export default function FleetsList() {
    const fleetList = useObservableState(fleetPagedList$, [])
    const isFetchComplete = useObservableState<boolean>(isFleetPagedListFetchComplete$, true)

    if (!isFetchComplete) {
        return <Loading />
    }

    console.log(fleetList)

    return (
        <Layout>
            {
                fleetList.map(fleet => {
                    return (
                        <li>{fleet.title}</li>
                    )
                })
            }
        </Layout>
    )
}

