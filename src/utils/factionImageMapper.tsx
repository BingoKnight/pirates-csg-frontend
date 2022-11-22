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

const factionImageMapper = {
    american: (props: any) => <AmericaImage {...props} />,
    'barbary corsair': (props: any) => <CorsairImage {...props} />,
    cursed: (props: any) => <CursedImage {...props} />,
    english: (props: any) => <EnglandImage {...props} />,
    french: (props: any) => <FranceImage {...props} />,
    'jade rebellion': (props: any) => <JadeImage {...props} />,
    mercenary: (props: any) => <MercenaryImage {...props} />,
    pirate: (props: any) => <PirateImage {...props} />,
    spanish: (props: any) => <SpainImage {...props} />,
    viking: (props: any) => <VikingImage {...props} />,
    "whitebeard's raiders": (props: any) => <WhiteBeardRaidersImage {...props} />
}

export default factionImageMapper

