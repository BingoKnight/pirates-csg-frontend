import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { getKeywordsDictionary, getPiratesCsgList } from '../api.js'
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
import Layout from '../components/Layout.tsx'
import Loading from '../components/Loading.tsx'
import PiratesCsgList from '../components/PiratesCsgList.tsx';
import Slider from '../components/Slider.tsx'
import TextInput from '../components/TextInput.tsx'
import ToggleButton from '../components/ToggleButton.tsx'

import { TABLET_VIEW, PHONE_VIEW } from '../constants.js'
import { ReactComponent as DownArrow } from '../images/angle-down-solid.svg'
import { ReactComponent as Arrow } from '../images/arrow-solid.svg'
import noImage from '../images/no-image.jpg'
import setIconMapper from '../utils/setIconMapper.tsx'

import '../styles/home.scss';

const pageSizeOptions = [10, 25, 50]

const SortOrder = {
    ascending: 'ascending',
    descending: 'descending'
}

// TODO: fix tablet view to be more like computer view
// TODO: preload image on faction query change
// TODO: replace spinning wheel with empty rows with moving gradient to signify loading

function FactionToggles({ factionList, filterFactions, queriedFactions }) {
    const [filteredFactions, setFilteredFactions] = useState(new Set(queriedFactions))
    console.log(filteredFactions)

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

function queryName(objItem, query) {
    return objItem.name.toLowerCase().includes(query.search.toLowerCase())
}

function queryAbility(objItem, query) {
    return objItem.ability.toLowerCase().includes(query.search.toLowerCase())
}

function queryFlavorText(objItem, query) {
    return objItem.flavorText.toLowerCase().includes(query.search.toLowerCase())
}

function queryKeywords(objItem, query) {
    return objItem.keywords.some(keyword =>
        keyword.toLowerCase().replace('-', ' ').includes(
            query.search.toLowerCase().replace('-', ' ')
        )
    )
}

function queryId(objItem, query) {
    return objItem.id.toLowerCase().includes(query.search.toLowerCase())
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
        id: sortIgnoreNull
    }

    return (sort.field in sortHandlers ? sortHandlers[sort.field] : defaultSort)(piratesCsgList, sort.order, sort.field)
}

function filterCsgList(piratesCsgList, query) {
    return piratesCsgList.filter(csgItem =>
        (
            !query.search
            || queryName(csgItem, query)
            || queryAbility(csgItem, query)
            // || queryFlavorText(csgItem, query)
            || queryKeywords(csgItem, query)
            || queryId(csgItem, query)
        )
        && (query.factions.length === 0 || query.factions.includes(csgItem.faction))
    )
}

function updateQuery(query, piratesCsgList, sort, setSorted, setFiltered) {
    if (!query.search && query.factions.length === 0) {
        setFiltered(piratesCsgList)
        setSorted(sortList(piratesCsgList, sort))
        return piratesCsgList.length
    } else {
        const filtered = filterCsgList(piratesCsgList, query)
        setFiltered(filtered)
        setSorted(sortList(filtered, sort))
        return filtered.length
    }

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
                selected={pageSize}
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

    const pageControlClass = 'page-control-container' + (className ? ` ${className}` : '')
    let nextPageLabel = 'Next'
    let prevPageLabel = 'Previous'

    if (windowWidth <= PHONE_VIEW) {
        nextPageLabel = <Arrow />
        prevPageLabel = <Arrow />
    }

    return (
        <div className={pageControlClass}>
            <div className="row page-control">
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
        </div>
    )
}

function getPiratesListPage(piratesList, pageSize, pageNumber) {
    return piratesList.slice(pageSize * (pageNumber - 1), pageSize * pageNumber)
}

function BaseMoveFilter() {
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
        const className = `base-move ${movementChars.join('-').toLowerCase()}`
        const movementText = movementChars.map(char => {
            if (char.toLowerCase() === 'l')
                return <span className='red'>{char}</span>
            return char
        }).reduce((prev, curr) => [prev, ' + ', curr])
        return <span className={className}>{movementText}</span>
    })

    return (
        <div className="row">
            <div className="col">
                <MultiItemDropdown
                    label="Base Move"
                    content={baseMoveLabels}
                    width="250px"
                    toggledListClass="selected-base-movement"
                    dropdownContentClass="base-movement"
                    // onChange={setPageSize}
                    // selected={pageSize}
                />
            </div>
        </div>
    )
}

function CsgTypeFilter() {
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

    return (
        <div className="row">
            <div className="col">
                <MultiItemDropdown
                    label="Type"
                    content={csgTypes}
                    width="250px"
                    toggledListClass="selected-type"
                    dropdownContentClass="csg-type"
                    // onChange={setPageSize}
                    // selected={pageSize}
                />
            </div>
        </div>
    )
}

function ExpansionSetFilter() {
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
        const containerClass = `set-container ${set[1].toLowerCase()}`
        const setIcon = setIconMapper[set[1]]({height: '25px'})
        return <div className={containerClass}>
            {setIcon && <div className='set-icon'>{setIcon}</div> }
            <div className={setNameClass}>{set[1]}</div>
            <div className="set-abbreviation">{set[0]}</div>
        </div>
    })

    return (
        <div className="row">
            <div className="col">
                <MultiItemDropdown
                    label="Set"
                    content={expansionSets}
                    width="250px"
                    toggledListClass="selected-set"
                    dropdownContentClass="set"
                    // onChange={setPageSize}
                    // selected={pageSize}
                />
            </div>
        </div>
    )
}

function RarityFilter() {
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

    return (
        <div className="row">
            <div className="col">
                <MultiItemDropdown
                    label="Rarity"
                    content={rarityLabels}
                    width="250px"
                    toggledListClass="icons-only"
                    dropdownContentClass="rarities"
                    // onChange={setPageSize}
                    // selected={pageSize}
                />
            </div>
        </div>
    )
}

function AdvancedFilters({ setQuery }) {
    const [ showContent, setShowContent ] = useState(false)
    const contentRef = useRef(null)

    let timer = null

    function handleShowContent() {
        clearTimeout(timer)

        if (showContent) {
            contentRef.current.style.overflow = 'hidden'
            setShowContent(false)
        } else {
            setShowContent(true)
            timer = setTimeout(() => contentRef.current.style.overflow = 'initial', 300)
        }
    }

    return (
        <div className="row advanced-filters-row">
            <div className="col">
                <div className="row advanced-filters-title">
                    <div className="col">
                        <span onClick={handleShowContent}>Advanced Filters</span>
                        <span><DownArrow /></span>
                    </div>
                </div>
                <div className={'row advanced-filters-content' + (showContent ? ' show': '')} ref={contentRef}>
                    <div className="col">
                        <div className="row">
                            <div className="col point-cost-title">Point Cost:</div>
                            <div className="col point-cost-slider">
                                <Slider
                                    defaultValue={[0, 35]}
                                    min={0}
                                    max={35}
                                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                />
                            </div>
                        </div>
                        <div className="row input-filter-row">
                            <div className="col number-inputs">
                                <div className="row">
                                    <div className="col">
                                        <TextInput label={'Masts'} id="masts" className="masts-input" disableSpellCheck />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <TextInput label={'Cargo'} id="cargo" className="cargo-input" disableSpellCheck />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <RarityFilter />
                                    <BaseMoveFilter />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <CsgTypeFilter />
                                    <ExpansionSetFilter />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

function Content({ windowWidth }) {
    const sessionStorageQuery = JSON.parse(sessionStorage.getItem('query'))

    const [query, setQuery] = useState({
        search: sessionStorageQuery?.search || '',
        factions: sessionStorageQuery?.factions || [],
        minPointCost: sessionStorageQuery?.minPointCost || 0,
        maxPointCost: sessionStorageQuery?.maxPointCost || 99,
        rarities: sessionStorageQuery?.rarities || [],
        type: sessionStorageQuery?.type || [],
        masts: sessionStorageQuery?.masts || -1,
        cargo: sessionStorageQuery?.cargo || -1,
        baseMove: sessionStorageQuery?.cargo || null,
        set: sessionStorageQuery?.set || []
    })

    const [completeCsgList, setCompleteCsgList] = useState(JSON.parse(sessionStorage.getItem('piratesCsgList')) || [])

    // filteredCsgList should be used to determine size because sortedCsgList doesn't affect maxPages
    const [filteredCsgList, setFilteredCsgList] = useState(filterCsgList(completeCsgList, query))

    const sessionStorageSort = JSON.parse(sessionStorage.getItem('sort'))
    const [sort, setSort] = useState(sessionStorageSort || {field: null, order: null})

    const [sortedCsgList, setSortedCsgList] = useState(sortList(filteredCsgList, sort))

    const localStoragePageSize = parseInt(localStorage.getItem('pageSize'))
    const defaultPageSize = pageSizeOptions.includes(localStoragePageSize) ? localStoragePageSize : 25
    const [pageSize, setPageSize] = useState(defaultPageSize || 25)
    const [maxPages, setMaxPages] = useState(calculateMaxPages(filteredCsgList.length, pageSize))
    const [pageNumber, setPageNumber] = useState(parseInt(sessionStorage.getItem('page')) || 1)

    const [apiFetchComplete, setApiFetchComplete] = useState(sessionStorage.getItem('piratesCsgList') !== null)

    const searchRef = useRef(null)

    const factionList = [
        ...new Set(
            completeCsgList
                .map(model => model.faction)
                .filter(faction => !['ut', 'none'].includes(faction.toLowerCase()))
        )
    ]

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
        setQuery({...query, search: searchRef.current.value})
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

    useEffect(() => {
        function updateCsgLists(csgList) {
            const filtered = csgList.filter(
                csgItem => csgItem.ability || !csgItem.set.toLowerCase() === 'unreleased'
            )
            setCompleteCsgList(filtered)
            setFilteredCsgList(filterCsgList(filtered, query))
            setSortedCsgList(sortList(filtered, sort))
        }

        async function fetchData() {
            updateCsgLists(await getPiratesCsgList())
            await getKeywordsDictionary()
            setApiFetchComplete(true)
        }

        if(!completeCsgList || completeCsgList.length === 0)
            fetchData()
    }, [])

    useEffect(() => {
        updateQuery(query, completeCsgList, sort, setSortedCsgList, setFilteredCsgList)
        sessionStorage.setItem('query', JSON.stringify(query))

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
        />
    }

    return (
        <>
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
                <AdvancedFilters setQuery={setQuery} />
            </div>
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

function Home() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    function updateWindowWidth() {
        const width = window.innerWidth
        setWindowWidth(width)
    }

    useEffect(() => {
        updateWindowWidth()
        window.addEventListener('resize', updateWindowWidth)
        return () => window.removeEventListener('resize', updateWindowWidth)
    })

    return (
       <Layout>
            <Outlet />
            <Content windowWidth={windowWidth} />
        </Layout>
    ) 
}

export default Home;

