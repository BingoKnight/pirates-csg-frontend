import React, {useEffect, useState} from 'react'

import Button from '../Button.tsx'
import CannonImage from '../CannonImages.tsx'
import { ReactComponent as DownArrow } from '../../images/angle-down-solid.svg'
import { ReactComponent as Copy } from '../../images/copy-regular.svg'
import { ReactComponent as CircleCheck } from '../../images/circle-check-regular.svg'
import noImage from '../../images/no-image.jpg'
import factionImageMapper from '../../utils/factionImageMapper.tsx'
import fieldIconMapper from '../../utils/fieldIconMapper.tsx'
import setIconMapper from '../../utils/setIconMapper.tsx'

import '../../styles/mainModal.scss'

function ModalOverlay({ closeModal, children }) {
    return (
        <div className='fixed-overlay' onClick={closeModal}>
            {children}
        </div>
    )
}

function CsgItemImage({ csgItem }) {
    return (
        <div id="image-container">
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
        <div className="col" id="points-col">
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
                <div className="col icon">{fieldIconMapper.baseMove({height: '20px'})}</div>
                <div className="col value">{baseMoveText}</div>
            </div>
    )
}

function CannonsCol({ cannons }) {
    const cannonsList = cannons
        .split('-')
        .map(cannon => <CannonImage cannon={cannon} height="15px"/>)
        .reduce((prev, curr) => [prev, ' ', curr])
    return (
            <div className="row stat cannons-stat">
                <div className="col icon">{fieldIconMapper.cannons({height: '20px'})}</div>
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
                        <div className="col icon">{fieldIconMapper.masts({height: '23px'})}</div>
                        <div className="col value">{csgItem.masts}</div>
                    </div>
                    <div className="row stat cargo-stat">
                        <div className="col icon">{fieldIconMapper.cargo({height: '23px'})}</div>
                        <div className="col value">{csgItem.cargo}</div>
                    </div>
                    <BaseMoveCol baseMove={csgItem.baseMove} />
                    <CannonsCol cannons={csgItem.cannons} />
                </div>
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
            <Copy onClick={handleClick} />
            {
                showTooltip
                && <div className="copy-tooltip">
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

function LinkIcon({ link }) {
    return (
        <div className="link-dropdown">
            <div className="hover-helper">
                <div className="link-tooltip">{link}</div>
            </div>
            <span className="link-icon noselect">
                {fieldIconMapper.link()}
            </span>
        </div>
    )
}

function CsgStats({ csgItem }) {
    return (
        <div className="col" id="stats-col">
            <div className="row">
                <div className="col" id="faction">
                    {
                        !['ut', 'none'].includes(csgItem.faction.toLowerCase())
                        && factionImageMapper[csgItem.faction.toLowerCase()]({height: '35px'})
                    }
                </div>
                <div className="col" id="name-col">
                    <span id="name">{csgItem.name}</span>
                    { csgItem.link && <LinkIcon link={csgItem.link} /> }
                </div>
                <CopyButton csgItemId={csgItem._id} />
            </div>

            { csgItem.type.toLowerCase() === 'ship' && <CsgShipStats csgItem={csgItem} /> }
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

function CsgItemDetails({ csgItem, closeModal }){
    return (
        <>
            <div className="row title-and-stats-row">
                {csgItem.pointCost && <CsgPoints pointCost={csgItem.pointCost} />}
                <CsgStats csgItem={csgItem} />
            </div>
            <div className="row">
                {
                    csgItem.type.toLowerCase() !== 'story'
                    && <Ability ability={csgItem.ability} />
                }
            </div>
            <div className="row">
                <div className="col" id="flavor-text">{csgItem.flavorText}</div>
            </div>
            {
                csgItem.keywords.length > 0 && <div className="row keywords-row">
                    <KeywordsSection keywords={csgItem.keywords} ability={csgItem.ability} />
                </div>
            }
            <div className="close-button-row">
                <Button className="close-button" onClick={closeModal}>Close</Button>
            </div>
        </>
    )
}

function MainModal({ csgItem, closeModalHandler }) {
    return (
        <ModalOverlay closeModal={closeModalHandler}>
            <div className="csg-modal" onClick={e => e.stopPropagation()}>
                <div className="row modal-content">
                    <div className="col" id="csg-image-col">
                        <CsgItemImage csgItem={csgItem} />
                        <div className="row">
                            <div className="col" id="set-text">
                                {setIconMapper[csgItem.set]({height: '40px'})}
                                <span> </span>
                                {csgItem.set}
                            </div>
                        </div>
                    </div>
                    <div className="col" id="csg-details-col">
                        <CsgItemDetails csgItem={csgItem} closeModal={closeModalHandler}/>
                    </div>
                </div>
            </div>
        </ ModalOverlay>
    )
}

export default MainModal

