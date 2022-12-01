import {
    BaseMoveImage,
    CannonsImage,
    CargoImage,
    FactionImage,
    LinkImage,
    MastsImage,
    PointCostImage,
    RarityImage
} from '../components/FieldIcons.tsx'

const fieldIconMapper = {
    baseMove: (props) => <BaseMoveImage {...props} />,
    cannons: (props) => <CannonsImage {...props} />,
    cargo: (props) => <CargoImage {...props} />,
    masts: (props) => <MastsImage {...props} />,
    link: (props) => <LinkImage {...props} />,
    rarity: (props) => <RarityImage {...props} />,
    faction: (props) => <FactionImage {...props} />,
    pointCost: (props) => <PointCostImage {...props} />
}

export default fieldIconMapper

