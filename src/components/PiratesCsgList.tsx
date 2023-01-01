import _ from 'lodash'
import { useObservableState } from 'observable-hooks'
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'

import CannonImage from './CannonImages.tsx'
import Button, { LinkButton } from './Button.tsx'
import { ReactComponent as Arrow } from '../images/angle-down-solid.svg'
import { isEditing$ } from '../services/editCollectionService.ts'
import { userCollection$ } from '../services/globalState.ts'
import { CsgItem } from '../types/csgItem.ts'
import factionImageMapper from '../utils/factionImageMapper.tsx'
import fieldIconMapper from '../utils/fieldIconMapper.tsx'
import setIconMapper from '../utils/setIconMapper.tsx'
import { isLoggedIn } from '../utils/user.ts'

import '../styles/piratesCsgList.scss'

// TODO: when scrolling down the bottom of the page is white, almost like the body is scrolling

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
    owned = 'owned'
    // flavorText = 'flavorText',
    // teasureValues = 'teasureValues'
}

function truncate(str: string, len = 40) {
    return str && str.length > len ? str.slice(0, len) + '...' : str
}

function CsgItemColumns({ csgItem }) {
    return Object.keys(OrderedCsgFields)
        .filter(fieldName => fieldName !== 'owned' || isLoggedIn())
        .map(fieldName => {
            if(fieldName === 'ability') {
                let abilityText = truncate(csgItem[fieldName])

                return <div className={`col csg-col ${fieldName}-col`}>{abilityText}</div>
            }
            if(fieldName === 'image') {
                return <div className="col csg-col">
                    <img src={csgItem.image} height="100px" alt={csgItem.name}/>
                </div>
            }

            if(fieldName === 'rarity') {
                const className = csgItem.rarity
                    .toLowerCase()
                    .replaceAll(' ', '-')
                    .replaceAll('1', 'one')  // Handle 1 of 1 rarity

                return <div className={`rarity-col ${className}-col`}>
                    <div className={className} />
                </div>
            }

            if(fieldName === 'faction') {
                const lowerCaseFaction = csgItem.faction.toLowerCase()
                const colClassName = lowerCaseFaction.replaceAll(' ', '-',).replaceAll('\'', '')
                return <div className={`col csg-col faction-col ${colClassName}-col`}>
                    {factionImageMapper[lowerCaseFaction] ? factionImageMapper[lowerCaseFaction]() : null}
                </div>
            }

            if(fieldName === 'baseMove') {
                const baseMoveText = csgItem[fieldName].split('+')
                    .map((letter: string) => {
                        if (letter === 'L') {
                            return <span style={{color: 'red'}}>{letter}</span>
                        }
                        return <span>{letter}</span>
                    }).reduce((prev, curr) => [prev, ' + ', curr])

                return <div className={`col csg-col windlass-font ${fieldName}-col`}>
                    {baseMoveText}
                </div>
            }

            if(fieldName === 'cannons') {
                const cannonsList = csgItem[fieldName]
                    .split('-')
                    .map((cannon: string) => <CannonImage cannon={cannon} />)
                    .reduce((prev, curr) => [prev, ' ', curr])

                return <div className={`col csg-col ${fieldName}-col`}>{cannonsList}</div>
            }

            if(fieldName === 'link') {
                const linkText = truncate(csgItem[fieldName], 25)
                return <div className={`col csg-col ${fieldName}-col`}>{linkText}</div>
            }

            if(fieldName === 'set') {
                return <div className={`col csg-col ${fieldName}-col`} title={csgItem[fieldName]}>
                    {setIconMapper[csgItem[fieldName]]({height: '25px'})}
                </div>
            }

            if(fieldName === 'owned') {
                if(csgItem[fieldName]) {
                    return <div className="col csg-col owned-col">
                        <span className="owned">✓</span>
                    </div>
                }

                return <div className="col csg-col owned-col">
                    <span className="not-owned">×</span>
                </div>
            }

            return <div className={`col csg-col ${fieldName}-col`}>{csgItem[fieldName]}</div>
        })
}

function CsgItemRows({ piratesCsgList, setStagedCollectionAdds, setStagedCollectionRemoves }) {
    const isEditingCollection = useObservableState<boolean>(isEditing$, false)
    const [csgItemsToUpdate, setCsgItemsToUpdate] = useState<string[]>([])

    function toggleCsgItem(csgItem: CsgItem) {
        const setStaged = csgItem.owned ? setStagedCollectionRemoves : setStagedCollectionAdds
        const newStagedItems = csgItemsToUpdate.includes(csgItem._id)
            ? csgItemsToUpdate.filter(id => id !== csgItem._id)
            : [...csgItemsToUpdate, csgItem._id]

        setCsgItemsToUpdate(newStagedItems)
        setStaged(newStagedItems)
    }

    function getLinkButtonProps(csgItem: CsgItem) {
        let backgroundColorClass = ''

        if (isEditingCollection && csgItem.owned && csgItem.owned > 0) {
            if(csgItemsToUpdate.includes(csgItem._id))
                backgroundColorClass = 'edit-mode-red'
            else
                backgroundColorClass = 'edit-mode-green'
        } else if (isEditingCollection && !csgItem.owned) {
            if(csgItemsToUpdate.includes(csgItem._id))
                backgroundColorClass = 'edit-mode-green'
            else
                backgroundColorClass = 'edit-mode-red'
        }

        const defaultProps = {
            className: `row csg-row csg-item-row noselect ${backgroundColorClass}`
        }
        if(isEditingCollection)
            return {
                ...defaultProps,
                onClick: () => toggleCsgItem(csgItem)
            }

        return {
            ...defaultProps,
            to: `details/${csgItem._id}`
        }
    }

    useEffect(() => {
        if (!isEditingCollection)
            setCsgItemsToUpdate([])
    }, [isEditingCollection])

    if(piratesCsgList.length === 0)
        return <div className="row csg-row no-items">
            No results found
        </ div>

    return piratesCsgList.map((csgItem: CsgItem) => (
        <LinkButton {...getLinkButtonProps(csgItem)}>
            <CsgItemColumns csgItem={csgItem} />
        </ LinkButton>
    ))
}

function HeaderRow({ sort, setSort }) {
    const headerRowRef = useRef(null)

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

    useEffect(() => {
        function onScroll() {
            if (headerRowRef?.current.offsetTop <= window.pageYOffset + 10 && !headerRowRef.current.className.includes('scrolling')) {
                headerRowRef.current.className = headerRowRef?.current?.className + ' scrolling'
            } else if (headerRowRef?.current.offsetTop > window.pageYOffset + 10 && headerRowRef.current.className.includes('scrolling')){
                headerRowRef.current.className = headerRowRef?.current?.className.replace(' scrolling', '')
            }
        }

        window.removeEventListener('scroll', onScroll)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className='row csg-row' id='header-row' ref={headerRowRef} >
            {
                Object.keys(OrderedCsgFields)
                    .filter(fieldName => fieldName !== 'owned' || isLoggedIn())
                    .map(fieldName => {
                    const defaultClassName = `noselect${fieldName === 'rarity' ? ' header-col csg-col' : ' header-col col csg-col'}`
                    const prettyNameMapper = {
                        id: 'ID',
                        pointCost: 'Points'
                    }

                    const prettyName = prettyNameMapper[fieldName] || _.capitalize(fieldName)
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

function PiratesCsgList({ piratesCsgList, sort, setSort, setStagedCollectionAdds, setStagedCollectionRemoves }) {
    const userCollection = useObservableState<CsgItem[]>(userCollection$, [])

    function getCsgListWithOwned() {
        let updatedPiratesCsgList = [...piratesCsgList]

        if(userCollection.length > 0) {
            return piratesCsgList.map((item: CsgItem) => {
                return {
                    ...item,
                    owned: userCollection.find(collectionItem => collectionItem._id === item._id)?.count
                }
            })
        }

        return updatedPiratesCsgList
    }

    return (
        <div id='csg-list'>
            <HeaderRow sort={sort} setSort={setSort} />
            <CsgItemRows
                piratesCsgList={getCsgListWithOwned()}
                setStagedCollectionAdds={setStagedCollectionAdds}
                setStagedCollectionRemoves={setStagedCollectionRemoves}
            />
        </div>
    )
}

export default PiratesCsgList

