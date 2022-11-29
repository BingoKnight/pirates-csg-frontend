import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getKeywordsDictionary, getPirateCsgList } from '../api.js'
import Button from '../components/Button.tsx'
import CsgModal from '../components/CsgModal.tsx'
import Dropdown from '../components/Dropdown.tsx'
import Layout from '../components/Layout.tsx'
import ToggleButton from '../components/ToggleButton.tsx'
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
import PirateCsgList from '../components/PiratesCsgList.tsx';
import TextInput from '../components/TextInput.tsx'

import '../styles/home.scss';

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

function PrevPageButton({ pageNumber, decrementPage }) {
    const isDisabled = pageNumber === 1
    const className = isDisabled ? 'disabled noselect' : 'noselect'

    return (
        <Button
            label="Previous"
            className={className}
            id='page-button'
            onClick={isDisabled ? null : decrementPage}
        >Previous</Button>
    )
}

function NextPageButton({ pageNumber, maxPages, incrementPage }) {
    const isDisabled = pageNumber === maxPages
    const className = isDisabled ? 'disabled noselect' : 'noselect'

    return (
        <Button
            className={className}
            id='page-button'
            onClick={isDisabled ? null : incrementPage}
        >Next</Button>
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
                style={{textDecoration: 'underline', width: '40px'}}
            >
                {num}
            </div>
        }
        return <div
            className='col page-number-col noselect'
            style={{width: '50px'}}
            onClick={() => setPageNumber(num)}
        >
            {num}
        </div>
    })
}

function PageSizeSelect({ setPageSize }) {
    if (!setPageSize)
        return null

    const pageSizeOptions = [10, 25, 50]
    return (
        <div className="col page-size-select-col">
            <Dropdown
                label="Rows"
                content={pageSizeOptions}
                onChange={setPageSize}
                selected={25}
            />
        </div>
    )
}

function PageControl(props) {
    const { pageNumber, maxPages, className, setPageNumber, setPageSize, lenPageNumbers = 9 } = props
    const totalPageNumbers = Math.min(lenPageNumbers, maxPages)

    function incrementPage() {
        setPageNumber(pageNumber + 1)
    }

    function decrementPage() {
        setPageNumber(pageNumber - 1)
    }

    const pageControlClass = 'page-control-container' + (className ? ` ${className}` : '')

    return (
        <div className={pageControlClass}>
            <div className="row page-control">
                <PageSizeSelect setPageSize={setPageSize} />
                <div className="col">
                    <PrevPageButton pageNumber={pageNumber} decrementPage={decrementPage} />
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
                    <NextPageButton pageNumber={pageNumber} maxPages={maxPages} incrementPage={incrementPage} />
                </div>
            </div>
        </div>
    )
}

function Content({ setActiveCsgItem }) {
    const [pirateCsgList, setPirateCsgList] = useState(JSON.parse(sessionStorage.getItem('pirateCsgList')) || [])
    const [filteredCsgList, setFilteredCsgList] = useState(pirateCsgList)

    const [ searchParams ] = useSearchParams()

    const [pageSize, setPageSize] = useState(25)
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

    function executeSearch() {
        setQuery({...query, search: searchRef.current.value})
    }

    function filterFactions(factionSet) {
        setQuery({...query, factions: [...factionSet]})
    }

    useEffect(() => {
        function updateCsgLists(csgList) {
            const filtered = csgList.filter(
                csgItem => csgItem.ability || !csgItem.set.toLowerCase() === 'unreleased'
            )
            setPirateCsgList(filtered)
            setFilteredCsgList(filtered)

            if (searchParams.has('_id')) {
                const match = filtered.find(item => item._id === searchParams.get('_id'))

                if (match) {
                    setActiveCsgItem(match)
                }
            }
        }

        async function fetchData() {
            updateCsgLists(await getPirateCsgList())
            await getKeywordsDictionary()
        }

        fetchData()
    }, [])

    useEffect(() => {
        updateQuery(query, pirateCsgList, setFilteredCsgList)
        sessionStorage.setItem('query', JSON.stringify(query))
        setPageNumber(1)
    }, [query])

    useEffect(() => {
        sessionStorage.setItem('page', pageNumber)
    }, [pageNumber])

    useEffect(() => {
        setMaxPages(calculateMaxPages(filteredCsgList.length, pageSize))
    }, [filteredCsgList])

    useEffect(() => {
        const newMaxPages = calculateMaxPages(filteredCsgList.length, pageSize)
        setMaxPages(newMaxPages)
        if (pageNumber > newMaxPages) {
            setPageNumber(newMaxPages)
        }
    }, [pageSize])

    return (
        <>
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
                </div>
            </div>
            <PageControl
                className="upper"
                pageNumber={pageNumber}
                maxPages={maxPages}
                setPageNumber={setPageNumber}
                lenPageNumbers={5}
                setPageSize={setPageSize}
            />
            <div className='result-content'>
                <PirateCsgList
                    pirateCsgList={filteredCsgList.slice(pageSize * (pageNumber - 1), pageSize * pageNumber)}
                    setActiveCsgItem={setActiveCsgItem}
                />
            </div>
            <PageControl
                className="lower"
                pageNumber={pageNumber}
                maxPages={maxPages}
                setPageNumber={setPageNumber}
            />
        </>
    )
}

function Home() {
    const [ activeCsgItem, setActiveCsgItem ] = useState(null)

    return (
        <Layout>
            <CsgModal csgItem={activeCsgItem} closeModal={() => setActiveCsgItem(null)} />
            <Content setActiveCsgItem={setActiveCsgItem} />
        </Layout>
    ) 
}

export default Home;

