import _ from 'lodash'
import { useObservableState } from 'observable-hooks'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

import { addToCollection, removeFromCollection } from '../api.js'
import Button from '../components/Button.tsx'
import Dropdown, { MultiItemDropdown } from '../components/Dropdown.tsx'
import {
    AmericaImage,
    CorsairImage,
    CursedImage,
    EnglandImage,
    FranceImage,
    JadeImage,
    MercenaryImage,
    PirateImage,
    SpainImage,
    VikingImage,
    WhiteBeardRaidersImage
} from '../components/FactionImages.tsx'
import Loading from '../components/Loading.tsx'
import PiratesCsgList from '../components/PiratesCsgList.tsx';
import Slider from '../components/Slider.tsx'
import { TextInput } from '../components/TextInput.tsx'
import ToggleButton from '../components/ToggleButton.tsx'
import { isEditing$, toggleIsEditing } from '../services/editCollectionService.ts'
import { CsgItem } from '../types/csgItem.ts'

import { TABLET_VIEW, PHONE_VIEW } from '../constants.js'
import { ReactComponent as DownArrow } from '../images/angle-down-solid.svg'
import { ReactComponent as Arrow } from '../images/arrow-solid.svg'
import { ReactComponent as Alert } from '../images/circle-exclamation-solid.svg'
import { ReactComponent as QuestionMark } from '../images/circle-question-regular.svg'
import { ReactComponent as Pencil } from '../images/pencil-solid.svg'
import { ReactComponent as Save } from '../images/save-solid.svg'
import { ReactComponent as Trash } from '../images/trash-solid.svg'
import noImage from '../images/no-image.jpg'
import setIconMapper from '../utils/setIconMapper.tsx'
import { isLoggedIn } from '../utils/user.ts'

import '../styles/home.scss';

const pageSizeOptions = [10, 25, 50]

const SortOrder = {
    ascending: 'ascending',
    descending: 'descending'
}

// TODO: fix tablet view to be more like computer view
// TODO: preload image on faction query change
// TODO: replace spinning wheel with empty rows with moving gradient to signify loading
// TODO: add redux, right now sorting by owned items count is based on session storage
//       which could be a problem if someone clears their session storage

function FactionToggles({ factionList, filterFactions, queriedFactions }) {
    const [filteredFactions, setFilteredFactions] = useState(new Set(queriedFactions))

    const factionNameMapper = {
        'american': <AmericaImage />,
        'barbary corsair': <CorsairImage />,
        'cursed': <CursedImage />,
        'english': <EnglandImage />,
        'french': <FranceImage />,
        'jade rebellion': <JadeImage />,
        'mercenary': <MercenaryImage />,
        'pirate': <PirateImage />,
        'spanish': <SpainImage />,
        'viking': <VikingImage />,
        "whitebeard's raiders": <WhiteBeardRaidersImage />

    }

    useEffect(() => {
        filterFactions(filteredFactions)
    }, [filteredFactions])

    function handleOnChangeBuilder(faction) {

        function handleOnChange(isToggled) {
            if (isToggled) {
                setFilteredFactions(new Set([...filteredFactions, faction]))
            } else {
                setFilteredFactions(new Set([...filteredFactions].filter(value => value !== faction)))
            }
        }

        return handleOnChange
    }

    return factionList.map(faction => {
        return <ToggleButton
            label={factionNameMapper[faction.toLowerCase()]}
            className="faction-toggle"
            id={faction}
            onClick={handleOnChangeBuilder(faction)}
            defaultToggle={queriedFactions.includes(faction)}
        />
    })
}

function calculateMaxPages(csgListSize, pageSize) {
    return Math.ceil(csgListSize / pageSize) || 1
}

function genericQuery(piratesCsgList, search) {
    return piratesCsgList.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
        || item.ability.toLowerCase().includes(search.toLowerCase())
        || item.id.toLowerCase().includes(search.toLowerCase())
        || item.keywords.some(keyword =>
            keyword.toLowerCase().replace('-', ' ').includes(
                search.toLowerCase().replace('-', ' ')
            )
        )
    )
}

function sortCompare(a, b, sortOrder) { // sortOrder will only be ascending or descending, sortList removes null case
    function ignoreQuotes(csgItemField) {
        if (typeof csgItemField === 'string')
            return csgItemField.replaceAll('\'', '').replaceAll('"', '').replaceAll('“', '')
        return csgItemField
    }

    if (sortOrder === SortOrder.ascending) {
        return ignoreQuotes(a) > ignoreQuotes(b) ? 1 : -1
    }

    return ignoreQuotes(a) < ignoreQuotes(b) ? 1 : -1
}

function sortRarity(csgList, sortOrder, _) {
    const rarityEnumerator = {
        common: 1,
        uncommon: 2,
        rare: 3,
        pr: 4,
        promo: 5,  // only includes whitebeard
        se: 6,
        le: 7,
        'super rare': 8,
        'special': 9,
        '1 of 1': 10
    }

    return [...csgList].sort((a, b) =>
        sortCompare(rarityEnumerator[a.rarity.toLowerCase()], rarityEnumerator[b.rarity.toLowerCase()], sortOrder)
    )
}

function sortBaseMove(csgList, sortOrder, _) {
    const baseMoveEnumerator = {
        t: 1,
        s: 2,
        l: 3,
        's+s': 4,
        's+l': 5,
        'l+s': 5,
        'l+l': 6,
        's+s+s': 7,
        'l+l+l': 8,
        d: 9
    }

    return [...csgList].filter(val => val.baseMove).sort((a, b) =>
        sortCompare(baseMoveEnumerator[a.baseMove.toLowerCase()], baseMoveEnumerator[b.baseMove.toLowerCase()], sortOrder)
    )
}

function sortIgnoreNull(csgList, sortOrder, sortField) {
    const sortedWithoutFalsy = [...csgList]
        .filter(val => val[sortField] || val[sortField] === 0)
        .sort((a, b) => sortCompare(a[sortField], b[sortField], sortOrder))

    return [...sortedWithoutFalsy, ...csgList.filter(val => isNaN(val[sortField]))]
}

function sortNumerically(csgList, sortOrder, sortField) {
    const unownedItems = csgList.filter(item => !item[sortField])
    const numericallySortedList = [...csgList]
        .filter(item => item[sortField])
        .sort((a, b) => {
            return sortCompare(a[sortField], b[sortField], sortOrder)
        })

    if(sortOrder === SortOrder.ascending) {
        return [...unownedItems, ...numericallySortedList]
    }

    return [...numericallySortedList, ...unownedItems]
}

function sortOwnedItems(csgList, sortOrder, _) {
    const userCollection = JSON.parse(sessionStorage.getItem('userCollection') || '[]')
    const csgListWithCount = csgList.map(item => {
        const matchingItem = userCollection.find(collectionItem => collectionItem._id === item._id)
        if(matchingItem) {
            return {
                ...item,
                count: matchingItem.count
            }
        }
        return item
    })

    return sortNumerically(csgListWithCount, sortOrder, 'count')
}

function defaultSort(csgList, sortOrder, sortField) {
    return [...csgList].sort((a, b) =>
        sortCompare(a[sortField], b[sortField], sortOrder)
    )
}

function sortList(piratesCsgList, sort) {
    if(!(sort.order && sort.field))
        return piratesCsgList

    const sortHandlers = {
        rarity: sortRarity,
        baseMove: sortBaseMove,
        masts: sortIgnoreNull,
        cargo: sortIgnoreNull,
        link: sortIgnoreNull,
        id: sortIgnoreNull,
        owned: sortOwnedItems
    }

    return (sort.field in sortHandlers ? sortHandlers[sort.field] : defaultSort)(piratesCsgList, sort.order, sort.field)
}

function queryName(piratesCsgList, name) {
    return piratesCsgList.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
}

function queryAbility(piratesCsgList, ability) {
    return piratesCsgList.filter(item => item.ability.toLowerCase().includes(ability.toLowerCase()))
}

function queryFlavorText(piratesCsgList, flavorText) {
    return piratesCsgList.filter(item => item.flavorText.toLowerCase().includes(flavorText.toLowerCase()))
}

function queryMaxPointCost(piratesCsgList, maxPointCost) {
    return piratesCsgList.filter(item => maxPointCost >= item.pointCost)
}

function queryMinPointCost(piratesCsgList, minPointCost) {
    return piratesCsgList.filter(item => minPointCost <= item.pointCost)
}

function queryFactions(piratesCsgList, factions) {
    return piratesCsgList.filter(item => factions.map(faction => faction.toLowerCase()).includes(item.faction.toLowerCase()))
}

function queryBaseMove(piratesCsgList, baseMoveArray) {
    return piratesCsgList.filter(item => baseMoveArray.includes(item.baseMove.toLowerCase()))
}

function querySet(piratesCsgList, expansionSets) {
    return piratesCsgList.filter(item => expansionSets.includes(item.set.toLowerCase()))
}

function queryType(piratesCsgList, csgType) {
    return piratesCsgList.filter(item => csgType.includes(item.type.toLowerCase()))
}

function queryRarity(piratesCsgList, rarities) {
    return piratesCsgList.filter(item => rarities.includes(item.rarity.toLowerCase()))
}

function queryMaxCargo(piratesCsgList, cargo) {
    return piratesCsgList.filter(item => cargo >= item.cargo)
}

function queryMinCargo(piratesCsgList, cargo) {
    return piratesCsgList.filter(item => cargo <= item.cargo)
}

function queryMaxMasts(piratesCsgList, masts) {
    return piratesCsgList.filter(item => masts >= item.masts)
}

function queryMinMasts(piratesCsgList, masts) {
    return piratesCsgList.filter(item => masts <= item.masts)
}

function queryKeywords(piratesCsgList, keywords) {
    return piratesCsgList.filter(item =>
        keywords.every(keyword =>
            item.keywords.some(itemKeyword => itemKeyword.toLowerCase().includes(keyword))
        )
    )
}

function updateQuery(piratesCsgList, query, sort = null, setSorted = null, setFiltered = null) {
    const queryFunctionMapper = {
        search: {
            isEmpty: querySearch => !querySearch,
            query: genericQuery
        },
        name: {
            isEmpty: nameFilter => !nameFilter,
            query: queryName
        },
        ability: {
            isEmpty: abilityFilter => !abilityFilter,
            query: queryAbility
        },
        flavorText: {
            isEmpty: flavorTextFilter => !flavorTextFilter,
            query: queryFlavorText
        },
        minCargo: {
            isEmpty: cargo => !(cargo || cargo === 0),
            query: queryMinCargo
        },
        maxCargo: {
            isEmpty: cargo => !(cargo || cargo === 0),
            query: queryMaxCargo
        },
        minMasts: {
            isEmpty: masts => !(masts || masts === 0),
            query: queryMinMasts
        },
        maxMasts: {
            isEmpty: masts => !(masts || masts === 0),
            query: queryMaxMasts
        },
        maxPointCost: {
            isEmpty: pointCost => !(pointCost || pointCost === 0),
            query: queryMaxPointCost
        },
        minPointCost: {
            isEmpty: pointCost => !(pointCost || pointCost === 0),
            query: queryMinPointCost
        },
        factions: {
            isEmpty: factions => factions.length === 0,
            query: queryFactions
        },
        baseMove: {
            isEmpty: baseMove => baseMove.length === 0,
            query: queryBaseMove
        },
        rarity: {
            isEmpty: rarity => rarity.length === 0,
            query: queryRarity
        },
        set: {
            isEmpty: set => set.length === 0,
            query: querySet
        },
        type: {
            isEmpty: type => type.length === 0,
            query: queryType
        },
        keywords: {
            isEmpty: keywords => keywords.length === 0 || (keywords.length === 1 && keywords[0] === ''),
            query: queryKeywords
        }
    }

    const filteredCsgList = Object.entries(query)
        .filter(([key, value]) => Object.keys(queryFunctionMapper).includes(key) && !queryFunctionMapper[key].isEmpty(value))
        .reduce((acc, [key, value]) => queryFunctionMapper[key].query(acc, value), piratesCsgList)

    if (setFiltered) {
        setFiltered(filteredCsgList)
    }

    if (sort && setSorted) {
        const sortedCsgList = sortList(filteredCsgList, sort)
        setSorted(sortedCsgList)
        return sortedCsgList
    }

    return filteredCsgList
}

function PageButton({ isDisabled, updatePage, className, children }) {
    return (
        <Button
            className={className + ' page-button ' + (isDisabled ? 'disabled noselect' : 'noselect')}
            onClick={isDisabled ? null : updatePage}
        >{children}</Button>
    )
}

function getPageNumbers(currentPageNumber, maxPages, lenPageNumbers) {
    if (maxPages === 0)
        return [1]

    let pageNumbers = []
    const half = Math.floor(lenPageNumbers / 2)

    let i = currentPageNumber + half < maxPages ? currentPageNumber - half : maxPages - (lenPageNumbers - 1)
    while (pageNumbers.length < lenPageNumbers) {
        if (i > 0) {
            pageNumbers.push(i)
        }
        i++;
    }

    if (!pageNumbers.includes(1) && !pageNumbers.includes(1 + 1)) {
        pageNumbers = [1, '...', ...pageNumbers]
    } else if (!pageNumbers.includes(1)) {
        pageNumbers = [1, ...pageNumbers]
    }

    if (!pageNumbers.includes(maxPages) && !pageNumbers.includes(maxPages - 1)) {
        pageNumbers = [...pageNumbers, '...', maxPages]
    } else if (!pageNumbers.includes(maxPages)) {
        pageNumbers = [...pageNumbers, maxPages]
    }

    return pageNumbers
}

function PageNumbers({ currentPageNumber, setPageNumber, maxPages, lenPageNumbers }) {
    let pageNumbers = getPageNumbers(currentPageNumber, maxPages, lenPageNumbers)

    return pageNumbers.map(num => {
        if (isNaN(num)) {  // then it is an ellipsis
            return <div className='col ellipsis'>...</div>
        }
        if (num === currentPageNumber) {
            return <div
                className='col page-number-col noselect'
                style={{textDecoration: 'underline'}}
            >
                {num}
            </div>
        }
        return <div
            className='col page-number-col noselect'
            onClick={() => setPageNumber(num)}
        >
            {num}
        </div>
    })
}

function PageSizeSelect({ pageSize, setPageSize }) {
    if (!(pageSize && setPageSize))
        return null

    return (
        <div className="col page-size-select-col">
            <Dropdown
                label="Rows"
                content={pageSizeOptions}
                onChange={setPageSize}
                defaultSelected={pageSize}
            />
        </div>
    )
}

function PageControl(props) {
    const { pageNumber, maxPages, className, setPageNumber, pageSize, setPageSize, windowWidth, lenPageNumbers = 9 } = props
    const totalPageNumbers = Math.min(lenPageNumbers, maxPages)

    function incrementPage() {
        setPageNumber(pageNumber + 1)
    }

    function decrementPage() {
        setPageNumber(pageNumber - 1)
    }

    const pageControlClass = 'row page-control' + (className ? ` ${className}` : '')
    let nextPageLabel = 'Next'
    let prevPageLabel = 'Previous'

    if (windowWidth <= PHONE_VIEW) {
        nextPageLabel = <Arrow />
        prevPageLabel = <Arrow />
    }

    return (
            <div className={pageControlClass}>
                <div className="row">
                <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
                </div>
                <div className="row">
                <div className="col">
                    <PageButton
                        className={'previous'}
                        isDisabled={pageNumber === 1}
                        updatePage={decrementPage}
                    >{prevPageLabel}</PageButton>
                </div>
                <div className="col" id="page-number-list">
                    <div className="row">
                        <PageNumbers
                            currentPageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            maxPages={maxPages}
                            lenPageNumbers={totalPageNumbers}
                        />
                    </div>
                </div>
                <div className="col">
                    <PageButton
                        className={'next'}
                        isDisabled={pageNumber === maxPages}
                        updatePage={incrementPage}
                    >{nextPageLabel}</PageButton>
                </div></div>
            </div>
    )
}

function getPiratesListPage(piratesList, pageSize, pageNumber) {
    return piratesList.slice(pageSize * (pageNumber - 1), pageSize * pageNumber)
}

function BaseMoveFilter({ defaultValue, onChange }) {
    const baseMoveLabels = [
        'S',
        'L',
        'S+S',
        'S+L',
        'L+S',
        'L+L',
        'S+S+S',
        'L+L+L',
        'T',
        'D'
    ].map(movement => {
        const movementChars = movement.split('+')
        const id = movementChars.join('-').toLowerCase()
        const className = `base-move ${id}`
        const movementText = movementChars.map(char => {
            if (char.toLowerCase() === 'l')
                return <span className='red'>{char}</span>
            return char
        }).reduce((prev, curr) => [prev, ' + ', curr])
        return <span className={className} id={id}>{movementText}</span>
    })

    const defaultSelected = baseMoveLabels.filter(element => {
        const id = element.props.id.replace('-', '')
        return defaultValue.map(value => value.replaceAll('+', '').toLowerCase()).includes(id)
    })

    return <MultiItemDropdown
        label="Base Move"
        content={baseMoveLabels}
        width="250px"
        toggledListClass="selected-base-movement"
        defaultSelected={defaultSelected}
        dropdownContentClass="base-movement"
        onChange={onChange}
        comparisonFunc={(value, option) => value.props.id === option.props.id}
    />
}

function CsgTypeFilter({ defaultValue, onChange }) {
    const csgTypes = [
        'Bust',
        'Crew',
        'Equipment',
        'Event',
        'Fort',
        'Island',
        'Ship',
        'Story',
        'Treasure'
    ]

    const defaultSelected = defaultValue.map(value => _.capitalize(value))

    return <MultiItemDropdown
        label="Type"
        content={csgTypes}
        defaultSelected={defaultSelected}
        width="250px"
        toggledListClass="selected-type"
        dropdownContentClass="csg-type"
        onChange={onChange}
    />
}

function ExpansionSetFilter({ defaultValue, onChange }) {
    const expansionSets = [
        ['BC', 'Barbary Coast'],
        ['BCU', 'Barbary Coast Unlimited'],
        ['PotC', 'Caribbean'],
        ['CC', 'Crimson Coast'],
        ['DJC', 'Davy Jones Curse'],
        ['F&S', 'Fire and Steel'],
        ['FN', 'Frozen North'],
        ['MI', 'Mysterious Islands'],
        ['OE', 'Oceans Edge'],
        ['RtSS', 'Return to Savage Shores'],
        ['RV', 'Revolution'],
        ['RVU', 'Revolution Unlimited'],
        ['RotF', 'Rise of the Fiends'],
        ['SS', 'Savage Shores'],
        ['SCS', 'South China Seas'],
        ['SM', 'Spanish Main First Edition'],
        ['SMU', 'Spanish Main Unlimited'],
        ['U', 'Unreleased']
    ].map(set => {
        const setNameClass = set === 'Unreleased' ? 'set-name' : 'set-name hidable'
        const setIcon = setIconMapper[set[1]]({height: '25px'})
        return <div className="set-container" id={set[1].toLowerCase().replaceAll(' ', '-')}>
            {setIcon && <div className='set-icon'>{setIcon}</div> }
            <div className={setNameClass}>{set[1]}</div>
            <div className="set-abbreviation">{set[0]}</div>
        </div>
    })

    const defaultSelected = expansionSets.filter(element => {
        const id = element.props.id.replaceAll('-', ' ')
        return defaultValue.map(value => value.toLowerCase()).includes(id)
    })

    return <MultiItemDropdown
        label="Set"
        content={expansionSets}
        width="250px"
        toggledListClass="selected-set"
        defaultSelected={defaultSelected}
        dropdownContentClass="set"
        onChange={onChange}
        comparisonFunc={(value, option) => value.props.id === option.props.id}
    />
}

function RarityFilter({ defaultValue, onChange }) {
    const rarityLabels = [
        <span id="common"><span>Common</span></span>,
        <span id="uncommon"><span>Uncommon</span></span>,
        <span id="rare"><span>Rare</span></span>,
        <span id="pr"><span>PR</span></span>,
        <span id="promo"><span>Promo</span></span>,
        <span id="le"><span>LE</span></span>,
        <span id="se"><span>SE</span></span>,
        <span id="super-rare"><span>Super Rare</span></span>,
        <span id="special"><span>Special</span></span>,
        <span id="one-of-one"><span>1 of 1</span></span>
    ]

    const defaultSelected = rarityLabels.filter(element => {
        const id = element.props.id === 'one-of-one' ? '1 of 1' : element.props.id.replaceAll('-', ' ')
        return defaultValue.includes(id)
    })

    return <MultiItemDropdown
        label="Rarity"
        content={rarityLabels}
        width="250px"
        toggledListClass="icons-only"
        defaultSelected={defaultSelected}
        dropdownContentClass="rarities"
        onChange={onChange}
        comparisonFunc={(value, option) => value.props.id === option.props.id}
    />
}

function AdvancedFilters({ query, setQuery, piratesCsgList }) {
    const [ showContent, setShowContent ] = useState(false)
    const [ isShowContentDisabled, setIsShowContentDisabled ] = useState(false)

    const initialInfoModalState = {
        title: null,
        content: null
    }

    const [ infoModal, setInfoModal ] = useState(initialInfoModalState)

    const initialState = {
        name: '',
        ability: '',
        flavorText: '',
        minPointCost: null,
        maxPointCost: null,
        minMasts: null,
        maxMasts: null,
        minCargo: null,
        maxCargo: null,
        rarity: [],
        type: [],
        baseMove: [],
        set: [],
        keywords: []
    }

    function isKeyInSessionStorage(key) {
        return key in query && (query[key] || query[key] === 0)
    }

    const [ stagedQuery, setStagedQuery ] = useState(
        Object.entries(initialState).reduce((acc, [key, value]) => {
            return {
                ...acc,
                ...{
                    [key]: isKeyInSessionStorage(key) ? query[key] : value
                }
            }
        }, {})

    )
    const [ pointCostKey, setPointCostKey ] = useState(uuid4)
    const [ mastsKey, setMastsKey ] = useState(uuid4)
    const [ cargoKey, setCargoKey ] = useState(uuid4)
    const [ rarityKey, setRarityKey ] = useState(uuid4)
    const [ typeKey, setTypeKey ] = useState(uuid4)
    const [ baseMoveKey, setBaseMoveKey ] = useState(uuid4)
    const [ expansionKey, setExpansionKey ] = useState(uuid4)

    const contentRef = useRef(null)
    const nameRef = useRef(null)
    const abilityRef = useRef(null)
    const flavorTextRef = useRef(null)
    const keywordRef = useRef(null)

    const maxPointCost = Math.max(...piratesCsgList.map(csgItem => csgItem.pointCost))
    const maxMasts = Math.max(...piratesCsgList.map(csgItem => csgItem.masts))
    const maxCargo = Math.max(...piratesCsgList.map(csgItem => csgItem.cargo))

    let timer = null

    function isInfoModalActive() {
        return infoModal
            && infoModal.title
            && infoModal.content
    }

    function queryHasActiveAdvancedFilter(query) {
        return query.name
            || query.ability
            || query.flavorText
            || query.minPointCost
            || query.maxPointCost
            || query.minMasts
            || query.maxMasts
            || query.minCargo
            || query.maxCargo
            || query.rarity.length > 0
            || query.type.length > 0
            || query.baseMove.length > 0
            || query.set.length > 0
            || query.keywords.length > 0
    }

    function handleShowContent() {
        if (isShowContentDisabled) return

        clearTimeout(timer)
        if (showContent) {
            contentRef.current.style.overflow = 'hidden'
            setShowContent(false)

            setIsShowContentDisabled(true)
            timer = setTimeout(() => {
                setIsShowContentDisabled(false)
            }, 200)
        } else {
            setShowContent(true)

            setIsShowContentDisabled(true)
            timer = setTimeout(() => {
                contentRef.current.style.overflow = 'initial'
                setIsShowContentDisabled(false)
            }, 200)
        }
    }

    function handleRarityChange(elements) {
        const values = elements.map(element => {
            const elementId = element.props.id
            if (elementId === 'one-of-one')
                return '1 of 1'

            return elementId.toLowerCase().replaceAll('-', ' ')
        })
        setStagedQuery({...stagedQuery, rarity: values})
    }

    function handleBaseMoveChange(elements) {
        const values = elements.map(element => element.props.id.replaceAll('-', '+').toLowerCase())
        setStagedQuery({...stagedQuery, baseMove: values})
    }

    function handleCsgTypeChange(values) {
        setStagedQuery({...stagedQuery, type: values.map(value => value.toLowerCase())})
    }

    function handleExpansionSetChange(elements) {
        const values = elements.map(element => element.props.id.replaceAll('-', ' ').toLowerCase())
        setStagedQuery({...stagedQuery, set: values})
    }

    function clearState() {
        setStagedQuery(initialState)
        setQuery({...query, ...initialState})
        setPointCostKey(uuid4())
        setMastsKey(uuid4())
        setCargoKey(uuid4())
        setRarityKey(uuid4())
        setBaseMoveKey(uuid4())
        setTypeKey(uuid4())
        setExpansionKey(uuid4())

        nameRef.current.value = ''
        abilityRef.current.value = ''
        flavorTextRef.current.value = ''
        keywordRef.current.value = ''
    }

    function handleSearch() {
        const name = nameRef.current.value.trim()
        const ability = abilityRef.current.value.trim()
        const flavorText = flavorTextRef.current.value.trim()
        const keywords = keywordRef.current.value
            .split(',')
            .filter(keyword => keyword)
            .map(keyword => keyword.trim().toLowerCase())

        setStagedQuery({...stagedQuery, name, ability, flavorText})
        setQuery({
            ...query,
            ...stagedQuery,
            name,
            ability,
            flavorText,
            keywords
        })
    }

    return (
        <>
            {
                isInfoModalActive()
                &&
                    <div className="info-modal-overlay" onClick={() => setInfoModal(initialInfoModalState)}>
                        <div className="info-modal" onClick={e => e.stopPropagation()}>
                            <div className="row title-row">
                                <div className="col">{infoModal.title}</div>
                            </div>
                            <div className="row content-row">
                                <div className="col">{infoModal.content}</div>
                            </div>
                            <div className="row close-button-row">
                                <div className="col">
                                    <Button className="close-button" onClick={() => setInfoModal(initialInfoModalState)}>Close</Button>
                                </div>
                            </div>
                        </div>
                    </div>
            }
            <div className="row advanced-filters-row">
                <div className="col">
                    <div className="row advanced-filters-title">
                        <div className="col">
                            <span onClick={handleShowContent}>
                                {
                                    !showContent
                                    && queryHasActiveAdvancedFilter(query)
                                    && <Alert
                                        className='active-filter-alert-icon'
                                        title='Advanced filters are affecting search results'
                                    />
                                }
                                <span className="title-text noselect">Advanced Filters</span>
                                <span><DownArrow className={'down-arrow noselect' + (showContent ? ' active' : '')} /></span>
                            </span>
                        </div>
                    </div>
                    <div className={'row advanced-filters-content' + (showContent ? ' show': '')} ref={contentRef}>
                        <div className="col">
                            <div className="row name-ability-row">
                                <div className="col name-filter">
                                    <TextInput
                                        label={'Name'}
                                        id={'name'}
                                        ref={nameRef}
                                        defaultValue={query.name || ''}
                                        onEnter={handleSearch}
                                        disableSpellCheck
                                    />
                                </div>
                                <div className="col ability-filter">
                                    <TextInput
                                        label={'Ability'}
                                        id={'ability'}
                                        ref={abilityRef}
                                        defaultValue={query.ability || ''}
                                        onEnter={handleSearch}
                                        disableSpellCheck
                                    />
                                </div>
                            </div>
                            <fieldset className="row point-cost-container">
                                <legend className='slider-title'>Points</legend>
                                <div className="col point-cost-slider">
                                    <Slider
                                        key={pointCostKey}
                                        defaultValue={[stagedQuery.minPointCost || 0, stagedQuery.maxPointCost || maxPointCost]}
                                        min={0}
                                        max={maxPointCost}
                                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                        onChange={
                                            ([min, max]) =>
                                                setStagedQuery({
                                                    ...stagedQuery,
                                                    minPointCost: min || null,
                                                    maxPointCost: max === maxPointCost ? null : max
                                                })
                                        }
                                    />
                                </div>
                            </fieldset>
                            <fieldset className="row masts-container">
                                <legend className='slider-title'>Masts</legend>
                                <div className="col masts-slider">
                                    <Slider
                                        key={mastsKey}
                                        defaultValue={[stagedQuery.minMasts || 0, stagedQuery.maxMasts || maxMasts]}
                                        min={0}
                                        max={maxMasts}
                                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                        onChange={
                                            ([min, max]) =>
                                                setStagedQuery({...stagedQuery, minMasts: min || null, maxMasts: max === maxMasts ? null : max})
                                        }
                                    />
                                </div>
                            </fieldset>
                            <fieldset className="row cargo-container">
                                <legend className='slider-title'>Cargo</legend>
                                <div className="col cargo-slider">
                                    <Slider
                                        key={cargoKey}
                                        defaultValue={[stagedQuery.minCargo || 0, stagedQuery.maxCargo || maxCargo]}
                                        min={0}
                                        max={maxCargo}
                                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                        onChange={
                                            ([min, max]) =>
                                                setStagedQuery({...stagedQuery, minCargo: min || null, maxCargo: max === maxCargo ? null : max})
                                        }
                                    />
                                </div>
                            </fieldset>
                            <div className="row">
                                <div className="col flavor-text-filter">
                                    <TextInput
                                        label={'Keyword(s)'}
                                        id={'keyword-filter'}
                                        ref={keywordRef}
                                        defaultValue={query.keywords.join(',') || ''}
                                        onEnter={handleSearch}
                                        disableSpellCheck
                                    />
                                    <div className='keyword-info'>
                                        <QuestionMark
                                            className='keyword-icon'
                                            onClick={() => setInfoModal({
                                                title: 'Keywords Search',
                                                content: 'Multiple keywords may be specified by comma delimitation. Eg. captain, helmsman'
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col flavor-text-filter">
                                    <TextInput
                                        label={'Flavor Text'}
                                        id={'flavor-text-filter'}
                                        ref={flavorTextRef}
                                        defaultValue={query.flavorText || ''}
                                        onEnter={handleSearch}
                                        disableSpellCheck
                                    />
                                </div>
                            </div>
                            <div className="row input-filter-row">
                                <div className="row multi-dropdown-row">
                                    <div className="col multi-dropdown-col">
                                        <RarityFilter key={rarityKey} defaultValue={stagedQuery.rarity} onChange={handleRarityChange} />
                                        <BaseMoveFilter key={baseMoveKey} defaultValue={stagedQuery.baseMove} onChange={handleBaseMoveChange} />
                                    </div>
                                </div>
                                <div className="row multi-dropdown-row">
                                    <div className="col multi-dropdown-col">
                                        <CsgTypeFilter key={typeKey} defaultValue={stagedQuery.type} onChange={handleCsgTypeChange} />
                                        <ExpansionSetFilter key={expansionKey} defaultValue={stagedQuery.set} onChange={handleExpansionSetChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row buttons-row">
                                <Button className="clear-button" onClick={clearState} >Clear</Button>
                                <Button className="search-button" onClick={handleSearch}>Search</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

function EditCollectionButtons({ isEditingCollection, saveEdits, discardEdits }) {
    if (!isLoggedIn())
        return null

    if (isEditingCollection) {
        return (
            <div className='row'>
                <Button className="save-edit-button" onClick={saveEdits}>
                    <Save width="15px" />
                    <span className="save-edit-button-text">Save</span>
                </Button>
                <Button className="discard-edit-button" onClick={discardEdits}>
                    <Trash width="15px" />
                    <span className="discard-edit-button-text">Discard</span>
                </Button>
            </div>
        )
    }

    return (
        <Button className="edit-collection-button" onClick={toggleIsEditing}>
            <Pencil width="15px" />
            <span className="edit-button-text">Edit Collection</span>
        </Button>
    )
}

function PiratesCsgSearch({ csgListSubscription, sessionStoragePiratesCsgListKey, sessionStorageQueryKey }) {
    const sessionStorageQuery = JSON.parse(sessionStorage.getItem(sessionStorageQueryKey))

    const [query, setQuery] = useState({
        search: sessionStorageQuery?.search || '',
        factions: sessionStorageQuery?.factions || [],
        name: sessionStorageQuery?.name || '',
        ability: sessionStorageQuery?.ability || '',
        flavorText: sessionStorageQuery?.flavorText || '',
        minPointCost: sessionStorageQuery?.minPointCost || null,
        maxPointCost: sessionStorageQuery?.maxPointCost || null,
        rarity: sessionStorageQuery?.rarity || [],
        type: sessionStorageQuery?.type || [],
        minMasts: sessionStorageQuery?.minMasts || null,
        maxMasts: sessionStorageQuery?.maxMasts || null,
        minCargo: sessionStorageQuery?.minCargo || null,
        maxCargo: sessionStorageQuery?.maxCargo || null,
        baseMove: sessionStorageQuery?.baseMove || [],
        set: sessionStorageQuery?.set || [],
        keywords: sessionStorageQuery?.keywords || []
    })

    const completeCsgList = useObservableState<CsgItem[]>(csgListSubscription, [])

    // filteredCsgList should be used to determine size because sortedCsgList doesn't affect maxPages
    const [filteredCsgList, setFilteredCsgList] = useState(updateQuery(completeCsgList, query))

    const sessionStorageSort = JSON.parse(sessionStorage.getItem('sort'))
    const [sort, setSort] = useState(sessionStorageSort || {field: null, order: null})
    const [sortedCsgList, setSortedCsgList] = useState(sortList(filteredCsgList, sort))

    const [stagedCollectionAdds, setStagedCollectionAdds] = useState<string[]>([])
    const [stagedCollectionRemoves, setStagedCollectionRemoves] = useState<string[]>([])

    const localStoragePageSize = parseInt(localStorage.getItem('pageSize'))
    const defaultPageSize = pageSizeOptions.includes(localStoragePageSize) ? localStoragePageSize : 25
    const [pageSize, setPageSize] = useState(defaultPageSize || 25)
    const [maxPages, setMaxPages] = useState(calculateMaxPages(filteredCsgList.length, pageSize))
    const [pageNumber, setPageNumber] = useState(parseInt(sessionStorage.getItem('page')) || 1)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const [apiFetchComplete, setApiFetchComplete] = useState(sessionStorage.getItem(sessionStoragePiratesCsgListKey) !== null)

    const isEditingCollection = useObservableState<boolean>(isEditing$, false)

    const searchRef = useRef(null)

    const factionList = [
        ...new Set(
            completeCsgList
                .map(model => model.faction)
                .filter(faction => !['ut', 'none'].includes(faction.toLowerCase()))
        )
    ]

    function saveEdits() {
        setApiFetchComplete(false)
        let requestPromises = []

        if (stagedCollectionRemoves.length > 0)
            requestPromises.push(removeFromCollection(stagedCollectionRemoves))

        if (stagedCollectionAdds.length > 0)
            requestPromises.push(addToCollection(stagedCollectionAdds))

        Promise.all(requestPromises).finally(() => {
            setApiFetchComplete(true)
            setStagedCollectionAdds([])
            setStagedCollectionRemoves([])
            toggleIsEditing()
        })
    }

    function discardEdits() {
        toggleIsEditing()
        setStagedCollectionAdds([])
        setStagedCollectionRemoves([])
    }

    function updatePageSize(value) {
        localStorage.setItem('pageSize', value)
        setPageSize(value)
    }

    function handleUpdatedSort(newSort) {
        setSort(newSort)
        setSortedCsgList(sortList(filteredCsgList, newSort))
        sessionStorage.setItem('sort', JSON.stringify(newSort))
    }

    function executeSearch() {
        setQuery({...query, search: searchRef.current.value.trim()})
    }

    function filterFactions(factionSet) {
        setQuery({...query, factions: [...factionSet]})
    }

    function promisePreload(src) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = function() {
                resolve(img)
            }
            img.onerror = img.onabort = function() {
                img.src = noImage
                resolve(img)
            }
            img.src = src
        })
    }

    async function preloadImages() {
        const imagePromiseList = getPiratesListPage(
            sortedCsgList,
            pageSize,
            pageNumber
        ).map(csgItem => promisePreload(csgItem.image))

        await Promise.all(imagePromiseList)
    }

    function updateWindowWidth() {
        const width = window.innerWidth
        setWindowWidth(width)
    }

    useEffect(() => {
        updateWindowWidth()
        window.addEventListener('resize', updateWindowWidth)
        return () => window.removeEventListener('resize', updateWindowWidth)
    })

    useEffect(() => {
        updateQuery(completeCsgList, query, sort, setSortedCsgList, setFilteredCsgList)
        setApiFetchComplete(true)
    }, [completeCsgList])

    useEffect(() => {
        updateQuery(completeCsgList, query, sort, setSortedCsgList, setFilteredCsgList)
        sessionStorage.setItem(sessionStorageQueryKey, JSON.stringify(query))

        const timer = setTimeout(() => {
            preloadImages()
        }, 500)

        return () => { clearTimeout(timer) }
    }, [query])

    useEffect(() => { sessionStorage.setItem('page', pageNumber) }, [pageNumber])

    useEffect(() => {
        const newMaxPages = calculateMaxPages(filteredCsgList.length, pageSize)
        setMaxPages(newMaxPages)
        if (pageNumber > newMaxPages) {
            setPageNumber(newMaxPages)
        }
    }, [filteredCsgList, pageSize])

    useEffect(() => {
        preloadImages()
    }, [pageNumber, completeCsgList])

    let piratesList = <Loading />

    if (apiFetchComplete) {
        piratesList = <PiratesCsgList
            piratesCsgList={getPiratesListPage(sortedCsgList, pageSize, pageNumber)}
            sort={sort}
            setSort={handleUpdatedSort}
            stagedCollectionAdds={stagedCollectionAdds}
            stagedCollectionRemoves={stagedCollectionRemoves}
            setStagedCollectionAdds={setStagedCollectionAdds}
            setStagedCollectionRemoves={setStagedCollectionRemoves}
        />
    }

    return (
        <>
            {
                windowWidth <= TABLET_VIEW
                && <div className="edit-collection-button-group mobile">
                    <EditCollectionButtons isEditingCollection={isEditingCollection} saveEdits={saveEdits} discardEdits={discardEdits} />
                </div>
            }
            <div className="row query-content">
                <div className="row search-row">
                    <TextInput
                        label={'Search'}
                        id={'search-text-box'}
                        ref={searchRef}
                        onChange={executeSearch}
                        defaultValue={query.search || ''}
                        disableSpellCheck
                    />
                </div>
                <div className="row faction-row">
                    <FactionToggles factionList={factionList} filterFactions={filterFactions} queriedFactions={query.factions}/>
                </div>
                {
                    completeCsgList.length > 0
                    && apiFetchComplete
                    && <AdvancedFilters query={query} setQuery={setQuery} piratesCsgList={completeCsgList} />
                }
            </div>
            <div className="page-edit-container">
                {
                    windowWidth > TABLET_VIEW
                    && <div className="edit-collection-button-group">
                        <EditCollectionButtons isEditingCollection={isEditingCollection} saveEdits={saveEdits} discardEdits={discardEdits} />
                    </div>
                }
                <PageControl
                    className="upper"
                    pageNumber={pageNumber}
                    maxPages={maxPages}
                    setPageNumber={setPageNumber}
                    lenPageNumbers={windowWidth <= TABLET_VIEW ? 3 : 5}
                    pageSize={pageSize}
                    setPageSize={updatePageSize}
                    windowWidth={windowWidth}
                />
            </div>
            <div className='result-content'>
                {piratesList}
            </div>
            <PageControl
                className="lower"
                pageNumber={pageNumber}
                maxPages={maxPages}
                setPageNumber={setPageNumber}
                lenPageNumbers={(() => {
                    if (windowWidth <= PHONE_VIEW) {
                        return 3
                    } if (windowWidth <= TABLET_VIEW) {
                        return 5
                    }
                    return undefined
                })()}
                windowWidth={windowWidth}
            />
        </>
    )
}

export default PiratesCsgSearch

