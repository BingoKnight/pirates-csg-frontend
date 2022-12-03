import React, {MouseEventHandler} from 'react'

import CannonImage from './CannonImages.tsx'
import {ReactComponent as Arrow} from '../images/angle-down-solid.svg'
import factionImageMapper from '../utils/factionImageMapper.tsx'
import fieldIconMapper from '../utils/fieldIconMapper.tsx'
import setIconMapper from '../utils/setIconMapper.tsx'
import {capitalize} from '../utils/string.tsx'

import '../styles/piratesCsgList.scss'

enum OrderedCsgFields {
    rarity = 'rarity',
    // image = 'image',
    faction = 'faction',
    pointCost = 'pointCost',
    name = 'name',
    type = 'type',
    masts = 'masts',
    cargo = 'cargo',
    baseMove = 'baseMove',
    cannons = 'cannons',
    ability = 'ability',
    link = 'link',
    set = 'set',
    id = 'id',
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
            return <div className="col csg-col">
                <img src={csgItem.image} height="100px" alt={csgItem.name}/>
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

        if (fieldName === 'set') {
            return <div className={`col csg-col ${fieldName}-col`} title={csgItem[fieldName]}>
                {setIconMapper[csgItem[fieldName]]({height: '25px'})}
            </div>
        }

        return <div className={`col csg-col ${fieldName}-col`}>{csgItem[fieldName]}</div>
    })
}

function CsgItemRows({ piratesCsgList, setActive }) {
    if (piratesCsgList.length === 0)
        return <div className="row csg-row no-items">
            No results found
        </ div>

    return piratesCsgList.map((csgItem: CsgItem) => (
        <div className={`row csg-row csg-item-row noselect`} onClick={() => setActive(csgItem)}>
            <CsgItemColumns csgItem={csgItem} />
        </ div>
    ))
}

function HeaderRow({ sort, setSort }) {
    const sortCycle = {
        null: 'ascending',
        ascending: 'descending',
        descending: null
    }

    function handleSort(fieldName: string) {
        setSort({
            order: sortCycle[fieldName === sort.field ? sort.order : null],
            field: fieldName
        })
    }

    return (
        <div className='row csg-row' id='header-row'>
        {
            Object.keys(OrderedCsgFields).map(fieldName => {
                const defaultClassName = `noselect${fieldName === 'rarity' ? ' header-col csg-col' : ' header-col col csg-col'}`
                const prettyNameMapper = {
                    id: 'ID',
                    pointCost: 'Points'
                }

                const prettyName = prettyNameMapper[fieldName] || capitalize(fieldName)
                let onClick : undefined | MouseEventHandler<HTMLDivElement> = () => handleSort(fieldName)
                let sortableHeaderClass : undefined | string = 'sortable-header'

                if (fieldName === 'cannons') {
                    onClick = undefined
                    sortableHeaderClass = undefined
                }

                return (
                    <div className={defaultClassName + ' ' + fieldName + '-col'} onClick={onClick}>
                        <div className={"sort-order ascending" + (sort.field === fieldName && sort.order === 'ascending' ? ' show': '')}>
                            <Arrow width="15px" />
                        </div>
                        <span className={sortableHeaderClass}>
                            {Object.keys(fieldIconMapper).includes(fieldName) ? fieldIconMapper[fieldName]() : prettyName}
                        </span>
                        <div className={"sort-order descending" + (sort.field === fieldName && sort.order === 'descending' ? ' show': '')}>
                            <Arrow width="15px" />
                        </div>
                    </div>
                )
            })
        }
        </ div>
    )
}

function PiratesCsgList({ piratesCsgList, setActiveCsgItem, sort, setSort }) {
    return (
        <div id='csg-list'>
            <HeaderRow sort={sort} setSort={setSort} />
            <CsgItemRows piratesCsgList={piratesCsgList} setActive={setActiveCsgItem} />
        </div>
    )
}

export default PiratesCsgList

