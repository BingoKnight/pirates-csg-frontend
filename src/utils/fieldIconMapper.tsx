import {
    BaseMoveImage,
    CannonsImage,
    CargoImage,
    CollectionImage,
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
    pointCost: (props) => <PointCostImage {...props} />,
    owned: (props) => <CollectionImage {...props} />
}

export default fieldIconMapper

