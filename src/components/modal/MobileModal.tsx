import React, { useState, useEffect } from 'react'

import Button from '../Button.tsx'
import CannonImage from '../CannonImages.tsx'

import { ReactComponent as DownArrow } from '../../images/angle-down-solid.svg'
import factionImageMapper from '../../utils/factionImageMapper.tsx'
import fieldIconMapper from '../../utils/fieldIconMapper.tsx'
import setIconMapper from '../../utils/setIconMapper.tsx'

import '../../styles/mobileModal.scss'

function LinkIcon({ link }) {
    return (
        <div className="row">
            <div className="col">
                {fieldIconMapper.link()} {link}
            </div>
        </div>
    )
}

function CsgItemImage({ csgItem }) {
    return (
        <div className="image-container">
            <img
                src={csgItem.image}
                className="noselect"
                id="csg-item-image"
                alt={csgItem.name}
                draggable="false"
            />
            <div className={csgItem.rarity.toLowerCase()} id='rarity-tab'>
                <div className="id-num">
                    {csgItem.id}
                </div>
                <div className="icon">
                    {setIconMapper[csgItem.set]({height: '25px'})}
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
    return (
        <div className="row csg-item-header">
            <CsgPoints pointCost={csgItem.pointCost} />
            <div className="col faction-title-col">
                <div className="row">
                    <div className="col faction-col">
                        <Faction faction={csgItem.faction} />
                    </div>
                    <div className="col title-col">
                        {csgItem.name}
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

    return <div className="col" id="ability-col" dangerouslySetInnerHTML={{__html: formattedAbility}} />
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
            <div className="row title" onClick={() => setExpanded(!isExpanded)}>
                <div className="col">
                    {keyword}
                </div>
                <div className="col caret">
                    <DownArrow className={isExpanded ? "active" : ""} />
                </div>
            </div>
            {
                isExpanded && <div className="row definition">
                    <div className="col" dangerouslySetInnerHTML={{__html: formattedDefinition}} />
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

function KeywordsSection({ keywords, ability }) {
    return (
        <>
            <div className="row">
                <div className="col keywords-title">Keywords</div>
            </div>
            <div className="overflow-scroll">
                <KeywordsList keywords={keywords} ability={ability} />
            </div>
        </>
    )
}

// TODO: add copy button
function MobileModal({csgItem, closeModalHandler }) {
    return (
        <div className="mobile-modal" onClick={e => e.stopPropagation()}>
            <div className="mobile-modal-content">
                <CsgItemHeader csgItem={csgItem} />
                <CsgShipStats csgItem={csgItem} />
                { csgItem.link && <LinkIcon link={csgItem.link} /> }
                <Ability ability={csgItem.ability} />
                <CsgItemImage csgItem={csgItem} />
                <FlavorText flavorText={csgItem.flavorText} />
                <KeywordsSection keywords={csgItem.keywords} ability={csgItem.ability} />
                <Button className="close-button" onClick={closeModalHandler}>Close</Button>
            </div>
        </div>
    )
}

export default MobileModal

