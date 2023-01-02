import { useObservableState } from 'observable-hooks'
import React, { useState, useEffect } from 'react'

import Button from '../Button.tsx'
import CannonImage from '../CannonImages.tsx'
import Layout from '../Layout.tsx'
import { ReactComponent as DownArrow } from '../../images/angle-down-solid.svg'
import { ReactComponent as CircleCheck } from '../../images/check-circle.svg'
import { ReactComponent as Copy } from '../../images/copy-regular.svg'
import noImage from '../../images/no-image.jpg'
import { ModalOptions } from './ModalBase.tsx'
import { userCollection$ } from '../../services/globalState.ts'
import { CsgItem } from '../../types/csgItem.ts'
import factionImageMapper from '../../utils/factionImageMapper.tsx'
import fieldIconMapper from '../../utils/fieldIconMapper.tsx'
import setIconMapper from '../../utils/setIconMapper.tsx'

import '../../styles/mobileModal.scss'

function CsgItemLink({ link }) {
    return (
        <div className="row csg-item-link-row">
            {fieldIconMapper.link()} {link}
        </div>
    )
}

function CsgItemImage({ csgItem }) {
    const rarityClass = csgItem.rarity.toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll('1', 'one')

    return (
        <div className="image-container">
            <img
                src={csgItem.image || noImage}
                className="noselect"
                id="csg-item-image"
                alt={csgItem.name}
                draggable="false"
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null // prevents looping
                    currentTarget.src = noImage
                }}
            />
            <div className="rarity-tab-container">
                <div className={rarityClass} id='rarity-tab'>
                    <div className="id-num">
                        {csgItem.id}
                    </div>
                    <div className="icon">
                        {setIconMapper[csgItem.set]({height: '25px'})}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CsgPoints({ pointCost }) {
    return (
        <div className="col points-col">
            <div className="row">
                <div className="col" id="point-cost">{pointCost}</div>
            </div>
            <div className="row">
                <div className="col" id="title">Points</div>
            </div>
        </div>
    )
}

function BaseMoveCol({ baseMove }) {
    const baseMoveText = baseMove.split('+')
        .map(letter => {
            if (letter === 'L') {
                return <span style={{color: 'red'}}>{letter}</span>
            }
            return <span>{letter}</span>
        }).reduce((prev, curr) => [prev, ' + ', curr])

    return (
            <div className="row stat base-move-stat">
                <div className="col icon">{fieldIconMapper.baseMove({height: '19px'})}</div>
                <div className="col value">{baseMoveText}</div>
            </div>
    )
}

function CannonsCol({ cannons }) {
    const cannonsList = cannons
        .split('-')
        .map(cannon => <CannonImage cannon={cannon} height="12px" width="14px"/>)
        .reduce((prev, curr) => [prev, ' ', curr])
    return (
            <div className="row stat cannons-stat">
                <div className="col icon">{fieldIconMapper.cannons({height: '16px'})}</div>
                <div className="col value">{cannonsList}</div>
            </div>
    )
}

function CsgShipStats({ csgItem }) {
    return (
        <div className="row stats-row">
            <div className="col">
                <div className="row">
                    <div className="row stat masts-stat">
                        <div className="col icon">{fieldIconMapper.masts({height: '20px'})}</div>
                        <div className="col value">{csgItem.masts}</div>
                    </div>
                    <div className="row stat cargo-stat">
                        <div className="col icon">{fieldIconMapper.cargo({height: '20px'})}</div>
                        <div className="col value">{csgItem.cargo}</div>
                    </div>
                    <BaseMoveCol baseMove={csgItem.baseMove} />
                    <CannonsCol cannons={csgItem.cannons} />
                </div>
            </div>
        </div>
    )
}

function Faction({ faction }) {
    return <span>{!['ut', 'none'].includes(faction.toLowerCase()) && factionImageMapper[faction.toLowerCase()]({height: '30px'})}</span>
}

function CsgItemHeader({ csgItem }) {
    const userCollection = useObservableState(userCollection$, [])

    const isInCollection = userCollection.map((item: CsgItem) => item._id).includes(csgItem._id)

    return (
        <div className="row csg-item-header">
            { (csgItem.pointCost || csgItem.pointCost === 0) && <CsgPoints pointCost={csgItem.pointCost} /> }
            <div className="col faction-title-col">
                <div className="row">
                    <div className="col faction-col">
                        <Faction faction={csgItem.faction} />
                    </div>
                    <div className="col title-col">
                        {csgItem.name}
                    </div>
                    <div className="col">
                        <ModalOptions csgItem={csgItem} isInCollection={isInCollection} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function getKeywordsDictionary() {
    const sessionKeywordsDictionary = sessionStorage.getItem('keywordsDictionary')
    if (!sessionKeywordsDictionary) {
        return {}
    }

    return JSON.parse(sessionKeywordsDictionary)
        .reduce((prev, curr) => ({...prev, [curr.name]: curr.definition}), {})
}

function formatKeywords(str: string) {
    let updatedStr = str
    const keywordsDictionary = getKeywordsDictionary()

    Object.keys(keywordsDictionary).forEach(keyword => {
        keyword = str.toLowerCase().includes(keyword.toLowerCase()) ? keyword : keyword.replaceAll(' ', '')
        updatedStr = updatedStr.replaceAll(keyword, `<span class='ability-keyword-text'>${keyword}</span>`)
    })
    
    return updatedStr
}

function formatMovement(str: string) {
    return str
        .replaceAll('+S', '<span class="windlass-white">+S</span>')
        .replaceAll(' S ', ' <span class="windlass-white">S</span> ')
        .replaceAll('+L', '<span class="windlass-white">+</span><span class="windlass-red">L</span>')
        .replaceAll(' L ', ' <span class="windlass-red">L</span> ')

}

function Ability({ ability }) {
    const formattedAbility = formatMovement(formatKeywords(ability))

    return (
        <div className="row ability-row">
            <div className="col" dangerouslySetInnerHTML={{__html: formattedAbility}} />
        </div>
    )
}

function FlavorText({ flavorText }) {
    return (
        <div id="flavor-text">{flavorText}</div>
    )
}

function KeywordItem({ keyword, definition }) {
    const [ isExpanded, setExpanded ] = useState(false)

    const formattedDefinition = formatMovement(formatKeywords(definition))

    return (
        <div className="keyword-item">
            <div className="row" onClick={() => setExpanded(!isExpanded)}>
                <div className="col title">
                    {keyword}
                </div>
                <div className="col caret">
                    <DownArrow className={isExpanded ? "active" : ""} />
                </div>
            </div>
            {
                isExpanded && <div className="row definition">
                    <div dangerouslySetInnerHTML={{__html: formattedDefinition}} />
                </div>
            }
        </div>
    )
}

function KeywordsList({ keywords, ability }) {
    const keywordsDictionary = getKeywordsDictionary()

    const uniqueKeywords = keywords
        .filter((keyword: string) => keyword !== 'Hoard')
        .filter((keyword: string)=> !['Octopus', 'Kraken'].includes(keyword) || ability.includes(keyword))


    return uniqueKeywords.map((keyword: string) => {
        return <KeywordItem
            keyword={keyword}
            definition={keywordsDictionary[keyword]}
        />
    })
}

function CsgSet({ csgItemSet }) {
    return (
        <div className="row">
            <div className="col set-text">
                {setIconMapper[csgItemSet]({height: '40px'})}
                <span> </span>
                {csgItemSet}
            </div>
        </div>
    )
}

function KeywordsSection({ keywords, ability }) {
    return (
        <div className='keywords-row'>
            <div className="row">
                <div className="col keywords-title">Keywords</div>
            </div>
            <div className="overflow-scroll">
                <KeywordsList keywords={keywords} ability={ability} />
            </div>
        </div>
    )
}

function CopyButton({ csgItemId }) {
    const [ showTooltip, setShowTooltip] = useState(false)

    function handleClick() {
        navigator.clipboard.writeText(`${process.env.REACT_APP_PIRATE_CSG_FE_BASE_URL}?_id=${csgItemId}`)
        setShowTooltip(true)
    }

    useEffect(() => {
        if (showTooltip) {
            const intervalId = setInterval(() => setShowTooltip(false), 7000)
            return () => clearInterval(intervalId)
        }
    }, [showTooltip])

    return (
        <div className="copy-button">
            <Copy onClick={handleClick} height="30px" />
            {
                showTooltip
                && <div className="copy-tooltip" onClick={() => setShowTooltip(false)}>
                    <div className="row">
                        <div className="col circle-check-col">
                            <CircleCheck />
                        </div>
                        <div className="col">Copied</div>
                    </div>
                </div>
            }
        </div>
    )
}

function DetailsContent({ csgItem, closeModal }) {
    return (
        <>
            <CsgItemHeader csgItem={csgItem} />
            { csgItem.type.toLowerCase() === 'ship' && <CsgShipStats csgItem={csgItem} /> }
            <Ability ability={csgItem.ability} />
            { csgItem.link && <CsgItemLink link={csgItem.link} /> }
            <CsgItemImage csgItem={csgItem} />
            <CsgSet csgItemSet={csgItem.set} />
            <FlavorText flavorText={csgItem.flavorText} />
            { csgItem.keywords.length > 0 && <KeywordsSection keywords={csgItem.keywords} ability={csgItem.ability} /> }
            <div className="row close-button-row">
                <Button className="close-button" onClick={closeModal}>Close</Button>
            </div>
        </>
    )
}

function MobileModal({ csgItem, closeModal }) {
    useEffect(() => {
        document.body.style.position = 'fixed'

        return function cleanup () {
            document.body.style.position = ''
        }
    })

    return (
        <div className="mobile-modal" onClick={e => e.stopPropagation()}>
            <div className="mobile-modal-content">
                <DetailsContent csgItem={csgItem} closeModal={closeModal} />
            </div>
        </div>
    )
}

export default MobileModal

