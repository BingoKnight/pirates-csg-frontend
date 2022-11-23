import React, { useState } from 'react'

import CannonImage from './CannonImages.tsx'

import factionImageMapper from '../utils/factionImageMapper.tsx'
import fieldIconMapper from '../utils/fieldIconMapper.tsx'
import {capitalize} from '../utils/string.tsx'

import '../styles/pirateCsgList.scss'

enum OrderedCsgFields {
    rarity = 'rarity',
    // image = 'image',
    faction = 'faction',
    id = 'id',
    name = 'name',
    type = 'type',
    pointCost = 'pointCost',
    masts = 'masts',
    cargo = 'cargo',
    baseMove = 'baseMove',
    cannons = 'cannons',
    ability = 'ability',
    link = 'link',
    // flavorText = 'flavorText',
    // teasureValues = 'teasureValues'
}

interface CsgItem {
    _id: string
    id: string
    image: string
    faction: string
    rarity: string
    type: string
    name: string
    pointCost: number
    masts: number
    cargo: number
    baseMove: string
    cannons: string
    link: string | null
    ability: string | null
    flavorText: string | null
    teasureValues: [number] | null
}

function truncate(str: string, len = 40) {
    return str && str.length > len ? str.slice(0, len) + '...' : str
}

function CsgItemColumns({ csgItem }) {
    return Object.keys(OrderedCsgFields).map(fieldName => {
        if (fieldName === 'ability') {
            let abilityText = truncate(csgItem[fieldName])

            return <div className={`col csg-col ${fieldName}-col`}>{abilityText}</div>
        }
        if (fieldName === 'image') {
            const updateImageUrl = csgItem[fieldName]?.replace(
                '/home/nathan/Projects/pirates-csg-api/public',
                'http://localhost:8080'
            )
            return <div className="col csg-col">
                <img src={updateImageUrl} height="100px" alt={csgItem.name}/>
            </div>
        }

        if (fieldName === 'rarity') {
            const className = csgItem.rarity
                .toLowerCase()
                .replaceAll(' ', '-')
                .replaceAll('1', 'one')  // Handle 1 of 1 rarity

            return <div className={`rarity-col ${className}-col`}>
                <div className={className} />
            </div>
        }

        if (fieldName === 'faction') {
            const lowerCaseFaction = csgItem.faction.toLowerCase()
            const colClassName = lowerCaseFaction.replaceAll(' ', '-',).replaceAll('\'', '')
            return <div className={`col csg-col faction-col ${colClassName}-col`}>
                {factionImageMapper[lowerCaseFaction] ? factionImageMapper[lowerCaseFaction]() : null}
            </div>
        }

        if (fieldName === 'baseMove') {
            const baseMoveText = csgItem[fieldName].split('+')
                .map(letter => {
                    if (letter === 'L') {
                        return <span style={{color: 'red'}}>{letter}</span>
                    }
                    return <span>{letter}</span>
                }).reduce((prev, curr) => [prev, ' + ', curr])

            return <div className={`col csg-col windlass-font ${fieldName}-col`}>
                {baseMoveText}
            </div>
        }

        if (fieldName === 'cannons') {
            const cannonsList = csgItem[fieldName]
                .split('-')
                .map(cannon => <CannonImage cannon={cannon} />)
                .reduce((prev, curr) => [prev, ' ', curr])

            return <div className={`col csg-col ${fieldName}-col`}>{cannonsList}</div>
        }

        if (fieldName === 'link') {
            const linkText = truncate(csgItem[fieldName], 25)
            return <div className={`col csg-col ${fieldName}-col`}>{linkText}</div>
        }

        return <div className={`col csg-col ${fieldName}-col`}>{csgItem[fieldName]}</div>
    })
}

function CsgItemRows({ pirateCsgList, setActive }) {
    if (pirateCsgList.length === 0)
        return <div className="row csg-row no-items">
            No results found
        </ div>

    return pirateCsgList.map((csgItem: CsgItem) => (
        <div className={`row csg-row csg-item-row noselect`} onClick={() => setActive(csgItem)}>
            <CsgItemColumns csgItem={csgItem} />
        </ div>
    ))
}

function HeaderRow() {
    return (
        <div className='row csg-row' id='header-row'>
        {
            Object.keys(OrderedCsgFields).map(fieldName => {
                const defaultClassName = fieldName === 'rarity' ? '' : 'col csg-col '
                const prettyNameMapper = {
                    id: 'ID',
                    pointCost: 'Points'
                }

                const prettyName = prettyNameMapper[fieldName] || capitalize(fieldName)

                return (
                    <div className={`${defaultClassName}${fieldName}-col`}>
                        {Object.keys(fieldIconMapper).includes(fieldName) ? fieldIconMapper[fieldName]() : prettyName}
                    </div>
                )
            })
        }
        </ div>
    )
}

function PirateCsgList({ pirateCsgList, setActiveCsgItem }) {
    return (
        <div id='csg-list'>
            <HeaderRow />
            <CsgItemRows pirateCsgList={pirateCsgList} setActive={setActiveCsgItem} />
        </div>
    )
}

export default PirateCsgList

