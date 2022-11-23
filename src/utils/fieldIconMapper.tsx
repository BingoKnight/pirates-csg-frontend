import {
    BaseMoveImage,
    CannonsImage,
    CargoImage,
    FactionImage,
    LinkImage,
    MastsImage,
    RarityImage
} from '../components/FieldIcons.tsx'

const fieldIconMapper = {
    baseMove: (props) => <BaseMoveImage {...props} />,
    cannons: (props) => <CannonsImage {...props} />,
    cargo: (props) => <CargoImage {...props} />,
    masts: (props) => <MastsImage {...props} />,
    link: (props) => <LinkImage {...props} />,
    rarity: (props) => <RarityImage {...props} />,
    faction: (props) => <FactionImage {...props} />
}

export default fieldIconMapper

