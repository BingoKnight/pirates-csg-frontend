import React from 'react'
import { ReactComponent as XIcon } from '../images/times.svg'

import Button from './Button.tsx'
import CannonImage from './CannonImages.tsx'
import { ReactComponent as Copy } from '../images/copy-regular.svg'
import factionImageMapper from '../utils/factionImageMapper.tsx'
import fieldIconMapper from '../utils/fieldIconMapper.tsx'
import setIconMapper from '../utils/setIconMapper.tsx'

import '../styles/csgModal.scss'
import {useSearchParams} from 'react-router-dom'

function ModalOverlay({ closeModal }) {
    return <>
        <div className='fixed-overlay' onClick={closeModal}>
        </div>
    </>
}

// TODO: show default image if image doesn't exist
function CsgItemImage({ csgItem }) {
    const csgItemImageUrl = csgItem.image?.replace(
        '/home/nathan/Projects/pirates-csg-api/public',
        'http://localhost:8080'
    )

    return (
        <div id="image-container">
            <img
                src={csgItemImageUrl}
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
        <div className="col" id="base-move-col">
            <div className="row stat">
                <div className="col icon">{fieldIconMapper.baseMove({height: '20px'})}</div>
                <div className="col value">{baseMoveText}</div>
            </div>
        </div>
    )
}

function CannonsCol({ cannons }) {
    const cannonsList = cannons
        .split('-')
        .map(cannon => <CannonImage cannon={cannon} height="15px"/>)
        .reduce((prev, curr) => [prev, ' ', curr])
    return (
        <div className="col" id="cannons-col">
            <div className="row stat">
                <div className="col icon">{fieldIconMapper.cannons({height: '20px'})}</div>
                <div className="col value">{cannonsList}</div>
            </div>
        </div>
    )
}

function CsgShipStats({ csgItem }) {
    return (
        <div className="row stats-row">
            <div className="col" id="masts-col">
                <div className="row stat">
                    <div className="col icon">{fieldIconMapper.masts({height: '23px'})}</div>
                    <div className="col value">{csgItem.masts}</div>
                </div>
            </div>
            <div className="col" id="cargo-col">
                <div className="row stat">
                    <div className="col icon">{fieldIconMapper.cargo({height: '23px'})}</div>
                    <div className="col value">{csgItem.cargo}</div>
                </div>
            </div>
            <BaseMoveCol baseMove={csgItem.baseMove} />
            <CannonsCol cannons={csgItem.cannons} />
        </div>
    )
}

function CopyButton({ csgItemId }) {
    function handleClick() {
        navigator.clipboard.writeText(`${process.env.REACT_APP_PIRATE_CSG_FE_BASE_URL}?_id=${csgItemId}`)
    }

    return <div className="copy-button"><Copy onClick={handleClick} /></div>
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
                <div className="col" id="name">{csgItem.name}</div>
                <CopyButton csgItemId={csgItem._id} />
            </div>
            { csgItem.type.toLowerCase() === 'ship' && <CsgShipStats csgItem={csgItem} /> }
        </div>
    )
}

function Ability({ ability, keywords }) {
    keywords.forEach(keyword => {
        if (ability.toLowerCase().includes(keyword.toLowerCase())) {
            ability = ability.replace(keyword, `<span class='keyword'>${keyword}</span>`)
            return
        }

        const keywordStrippedSpaces = keyword.replaceAll(' ', '')
        if (ability.toLowerCase().includes(keywordStrippedSpaces.toLowerCase())) {
            ability = ability.replace(keywordStrippedSpaces, `<span class='keyword'>${keywordStrippedSpaces}</span>`)
            return
        }
    })
    return <div className="col" id="ability-col" dangerouslySetInnerHTML={{__html: ability}} />
}

function CsgItemDetails({ csgItem, closeModal }){
    return (
        <div className="csg-details-container">
            <div className="row">
                {csgItem.pointCost && <CsgPoints pointCost={csgItem.pointCost} />}
                <CsgStats csgItem={csgItem} />
            </div>
            {
                csgItem.link &&
                <div className="row link-row">
                    <div className="col">{fieldIconMapper.link()} Link {csgItem.link}</div>
                </div>
            }
            <div className="row">
                {
                    csgItem.type.toLowerCase() !== 'story'
                    && <Ability ability={csgItem.ability} keywords={csgItem.keywords} />
                }
            </div>
            <div className="row">
                <div className="col" id="flavor-text">{csgItem.flavorText}</div>
            </div>
            <div className="row close-button-row">
                <div className="col">
                    <Button label="Close" onClick={closeModal} />
                </div>
            </div>
            {/*<div className="row keywords-row">
                <div className="col">
                    {
                        csgItem.keywords.map(keyword => (
                            <div className="row keyword">
                                <div className="col">{keyword}</div>
                            </div>
                        ))
                    }
                </div>
            </div>*/}
        </div>
    )
}

function CsgModal({ csgItem, closeModal }) {
    const [ searchParams, setSearchParams ] = useSearchParams()

    function closeModalHandler() {
        closeModal()

        if (searchParams.has('_id')) {
            searchParams.delete('_id')
            setSearchParams(searchParams)
        }
    }

    if (!csgItem)
        return null

    return (
        <>
            <ModalOverlay closeModal={closeModalHandler} />
            {/*<div className="modal-container">*/}
                <div className="csg-modal">
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
                {/*</div>*/}
        </>
    )
}

export default CsgModal

