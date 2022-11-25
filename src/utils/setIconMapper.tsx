import {
    BarbaryCoastIcon,
    CrimsonCoastIcon,
    DavyJonesCurseIcon,
    FireAndSteelIcon,
    FrozenNorthIcon,
    MysteriousIslandsIcon,
    OceansEdgeIcon,
    PiratesOfTheCaribbeanIcon,
    RevolutionIcon,
    RiseOfFiendsIcon,
    SavageShoresIcon,
    SouthChinaSeasIcon,
    SpanishMainIcon
} from '../components/SetIcons.tsx'

const setIconMapper = {
    'Barbary Coast': (props: any) => <BarbaryCoastIcon {...props} />,
    'Barbary Coast Unlimited': (props: any) => <BarbaryCoastIcon {...props} />,
    'Caribbean': (props: any) => <PiratesOfTheCaribbeanIcon {...props} />,
    'Crimson Coast': (props: any) => <CrimsonCoastIcon {...props} />,
    'Davy Jones Curse': (props: any) => <DavyJonesCurseIcon {...props} />,
    'Fire and Steel': (props: any) => <FireAndSteelIcon {...props} />,
    'Frozen North': (props: any) => <FrozenNorthIcon {...props} />,
    'Mysterious Islands': (props: any) => <MysteriousIslandsIcon {...props} />,
    'Oceans Edge': (props: any) => <OceansEdgeIcon {...props} />,
    'Return to Savage Shores': (props: any) => <SavageShoresIcon {...props} />,
    'Revolution': (props: any) => <RevolutionIcon {...props} />,
    'Revolution Unlimited': (props: any) => <RevolutionIcon {...props} />,
    'Rise of the Fiends': (props: any) => <RiseOfFiendsIcon {...props} />,
    'Savage Shores': (props: any) => <SavageShoresIcon {...props} />,
    'South China Seas': (props: any) => <SouthChinaSeasIcon {...props} />,
    'Spanish Main First Edition': (props: any) => <SpanishMainIcon {...props} />,
    'Spanish Main Unlimited': (props: any) => <SpanishMainIcon {...props} />,
    'Unreleased': (props: any) => null
}

export default setIconMapper

