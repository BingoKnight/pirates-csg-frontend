import { useEffect, useRef, useState } from 'react'

import { getPirateCsgList } from './api.js'
import Button from './components/Button.tsx'
import CsgModal from './components/CsgModal.tsx'
import Layout from './components/Layout.tsx'
import ToggleButton from './components/ToggleButton.tsx'
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
} from './components/FactionImages.tsx'
import PirateCsgList from './components/PiratesCsgList.tsx';
import TextInput from './components/TextInput.tsx'

import './App.scss';

// TODO: try pre loading images to prevent images from previous page from briefly displaying over
// new page rows

// Bugs:
// TODO: on initial page load (not refresh) max pages is 0

function FactionCheckboxes({ factionList, filterFactions }) {
    const [filteredFactions, setFilteredFactions] = useState(new Set())

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
            className={'faction-toggle'}
            id={faction}
            onClick={handleOnChangeBuilder(faction)}
        />
    })
}

function calculateMaxPages(csgListSize, pageSize) {
    return Math.ceil(csgListSize / pageSize)
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

function updateQuery(query, pirateCsgList, setFiltered) {
    if (!query.search && query.factions.length === 0) {
        setFiltered(pirateCsgList)
        return pirateCsgList.length
    } else {
        const filtered = pirateCsgList.filter(csgItem =>
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
        setFiltered(filtered)
        return filtered.length
    }

}

function Content({ setActiveCsgItem }) {
    const [pirateCsgList, setPirateCsgList] = useState(JSON.parse(sessionStorage.getItem('pirateCsgList')) || [])

    const [filteredCsgList, setFilteredCsgList] = useState(pirateCsgList)

    const pageSize = 50
    const [maxPages, setMaxPages] = useState(calculateMaxPages(filteredCsgList.length, pageSize))
    const [pageNumber, setPageNumber] = useState(parseInt(sessionStorage.getItem('page')) || 1)

    const sessionStorageQuery = JSON.parse(sessionStorage.getItem('query'))

    const [query, setQuery] = useState({
        search: sessionStorageQuery?.search || '',
        factions: sessionStorageQuery?.factions || [],
    })
    const searchRef = useRef(null)

    const factionList = [
        ...new Set(
            pirateCsgList
                .map(model => model.faction)
                .filter(faction => !['ut', 'none'].includes(faction.toLowerCase()))
        )
    ]

    function incrementPage() {
        setPageNumber(pageNumber + 1)
    }

    function decrementPage() {
        setPageNumber(pageNumber - 1)
    }

    function executeSearch() {
        setQuery({...query, search: searchRef.current.value})
    }

    function filterFactions(factionSet) {
        setQuery({...query, factions: [...factionSet]})
    }

    useEffect(() => {
        function updateCsgLists(csgList) {
            setPirateCsgList(csgList)
            setFilteredCsgList(csgList)
        }

        async function fetchData() {
            updateCsgLists(await getPirateCsgList())
        }
        fetchData()
    }, [])

    useEffect(() => {
        const filteredCsgListSize = updateQuery(query, pirateCsgList, setFilteredCsgList)
        sessionStorage.setItem('query', JSON.stringify(query))
    }, [query])

    useEffect(() => {
        sessionStorage.setItem('page', pageNumber)
    }, [pageNumber])

    useEffect(() => {
        setMaxPages(calculateMaxPages(filteredCsgList.length, pageSize))
    }, [filteredCsgList])

    return (
        <div id='content'>
            <div className='page-content'>
                <div className="query-content">
                    <div className="row">
                        <div className="col" />
                        <div className="col">
                            <div className="row">
                                <TextInput
                                    label={'Search'}
                                    id={'search-text-box'}
                                    ref={searchRef}
                                    onChange={executeSearch}
                                    defaultValue={query.search || ''}
                                    disableSpellCheck
                                />
                            </div>
                            <div className="row">
                                <FactionCheckboxes factionList={factionList} filterFactions={filterFactions} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="row">
                                {/* disable prev or next button, don't make disappear */}
                                <div className="col">
                                    Page: {pageNumber}/{maxPages}
                                </div>
                                <div className="col">
                                    {
                                        pageNumber > 1
                                        && <Button
                                                label="Previous"
                                                id='next-page-button'
                                                onClick={decrementPage}
                                            />
                                    }
                                </div>
                                <div className="col">
                                    {
                                        pageNumber < maxPages
                                        && <Button
                                                label="Next"
                                                id='prev-page-button'
                                                onClick={incrementPage}
                                            />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='result-content'>
                    <PirateCsgList
                        pirateCsgList={filteredCsgList.slice(pageSize * (pageNumber - 1), pageSize * pageNumber)}
                        setActiveCsgItem={setActiveCsgItem}
                    />
                </div>
            </div>
        </div>
    )
}

function App() {
    const [ activeCsgItem, setActiveCsgItem ] = useState(null)

    return (
        <Layout>
            <CsgModal csgItem={activeCsgItem} closeModal={() => setActiveCsgItem(null)} />
            <Content setActiveCsgItem={setActiveCsgItem} />
        </Layout>
    ) 
}

export default App;

