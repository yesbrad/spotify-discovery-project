const data = [
	"dance pop",
	"pop rap",
	"rap",
	"tropical house",
	"post-teen pop",
	"rock",
	"trap music",
	"hip hop",
	"southern hip hop",
	"latin",
	"pop rock",
	"dwn trap",
	"edm",
	"neo mellow",
	"alternative rock",
	"r&b",
	"classic rock",
	"latin pop",
	"album rock",
	"indie pop",
	"alternative metal",
	"indie rock",
	"mellow gold",
	"post-grunge",
	"viral pop",
	"hard rock",
	"singer-songwriter",
	"indie r&b",
	"pop punk",
	"folk-pop",
	"soft rock",
	"tropical",
	"reggaeton",
	"indie folk",
	"indietronica",
	"electro house",
	"nu metal",
	"permanent wave",
	"canadian pop",
	"gangster rap",
	"indie poptimism",
	"urban contemporary",
	"contemporary country",
	"hip pop",
	"country road",
	"country",
	"garage rock",
	"folk rock",
	"house",
	"big room",
	"latin hip hop",
	"rap metal",
	"rock en espanol",
	"stomp and holler",
	"funk rock",
	"soul",
	"dirty south rap",
	"chamber pop",
	"grupera",
	"europop",
	"underground hip hop",
	"regional mexican",
	"modern country rock",
	"blues-rock",
	"roots rock",
	"synthpop",
	"dance rock",
	"alternative dance",
	"new wave pop",
	"neo soul",
	"adult standards",
	"emo",
	"progressive house",
	"west coast rap",
	"new wave",
	"classic funk rock",
	"banda",
	"quiet storm",
	"latin alternative",
	"neo-psychedelic",
	"new rave",
	"psychedelic rock",
	"norteno",
	"deep big room",
	"spanish pop",
	"progressive electro house",
	"art rock",
	"rap rock",
	"trap latino",
	"funk",
	"teen pop",
	"motown",
	"shimmer pop",
	"electronic",
	"metal",
	"deep pop r&b",
	"deep indie r&b",
	"brostep",
	"deep tropical house",
	"crunk",
	"regional mexican pop",
	"screamo",
	"reggaeton flow",
	"escape room",
	"electronic trap",
	"punk",
	"new romantic",
	"disco",
	"pixie",
	"swedish pop",
	"acoustic pop",
	"new americana",
	"indie anthem-folk",
	"pop reggaeton",
	"metropopolis",
	"metalcore",
	"vapor soul",
	"focus",
	"hardcore hip hop",
	"deep german hip hop",
	"trap francais",
	"jazz blues",
	"brill building pop",
	"deep funk carioca",
	"folk",
	"francoton",
	"bass trap",
	"swedish idol pop",
	"southern rock",
	"east coast hip hop",
	"freak folk",
	"chillwave",
	"christian alternative rock",
	"talent show",
	"german hip hop",
	"vocal jazz",
	"groove metal",
	"dance-punk",
	"modern blues",
	"ranchera",
	"piano rock",
	"worship",
	"hollywood",
	"soundtrack",
	"boy band",
	"g funk",
	"lo-fi",
	"british blues",
	"redneck",
	"soul blues",
	"country rock",
	"new jack swing",
	"rock-and-roll",
	"christian music",
	"vegas indie",
	"argentine rock",
	"memphis soul",
	"ccm",
	"protopunk",
	"noise pop",
	"moombahton",
	"deep underground hip hop",
	"glam metal",
	"deep pop edm",
	"detroit hip hop",
	"mpb",
	"southern soul",
	"sertanejo universitario",
	"electric blues",
	"cantautor",
	"compositional ambient",
	"german pop",
	"traditional folk",
	"melodic metalcore",
	"britpop",
	"outlaw country",
	"christian rock",
	"downtempo",
	"deep dutch hip hop",
	"underground pop rap",
	"cumbia pop",
	"dream pop",
	"k-pop",
	"complextro",
	"alternative hip hop",
	"korean pop",
	"glam rock",
	"chicago soul",
	"tracestep",
	"deep australian indie",
	"funk metal",
	"traditional country",
	"grunge",
	"pop emo",
	"british invasion",
	"deep german pop rock",
	"indiecoustica",
	"deep groove house",
	"australian dance",
	"trip hop",
	"vapor twitch",
	"grime",
	"anthem worship",
	"speed metal",
	"scorecore",
	"pagode",
	"disco house",
	"italian arena pop",
	"italian pop",
	"melancholia",
	"classical",
	"channel pop",
	"indie psych-rock",
	"catstep",
	"lilith",
	"anti-folk",
	"samba",
	"mariachi",
	"reggae fusion",
	"swedish folk pop",
	"skate punk",
	"minimal dub",
	"slow core",
	"roots reggae",
	"video game music",
	"cumbia",
	"bubblegum pop",
	"nu gaze",
	"australian alternative rock",
	"la indie",
	"rockabilly",
	"deep trap",
	"duranguense",
	"jazz",
	"texas country",
	"german techno",
	"symphonic rock",
	"chillhop",
	"dancehall",
	"bachata",
	"progressive metal",
	"alt-indie rock",
	"bossa nova",
	"reggae",
	"candy pop",
	"otacore",
	"lift kit",
	"french pop",
	"nu jazz",
	"madchester",
	"merseybeat",
	"romantic",
	"comic",
	"deep latin hip hop",
	"progressive rock",
	"space rock",
	"power metal",
	"classify",
	"deep danish pop",
	"alternative country",
	"danish pop",
	"etherpop",
	"hoerspiel",
	"uk funky",
	"thrash metal",
	"spanish rock",
	"sky room",
	"sertanejo",
	"jam band",
	"eurodance",
	"trance",
	"deep cumbia sonidera",
	"nashville sound",
	"mandopop",
	"swedish indie rock",
	"finnish dance pop",
	"lounge",
	"taiwanese pop",
	"deep southern trap",
	"brazilian hip hop",
	"industrial metal",
	"french hip hop",
	"chamber psych",
	"jazz funk",
	"bolero",
	"deep euro house",
	"bow pop",
	"swedish alternative rock",
	"post-punk",
	"deep taiwanese pop",
	"shiver pop",
	"turkish pop",
	"alternative emo",
	"progressive trance",
	"cool jazz",
	"bubblegum dance",
	"forro",
	"finnish pop",
	"salsa",
	"c-pop",
	"show tunes",
	"world worship",
	"filter house",
	"nueva cancion",
	"preverb",
	"country dawn",
	"punk blues",
	"brooklyn indie",
	"post-screamo",
	"cabaret",
	"merengue",
	"power pop",
	"minimal",
	"opm",
	"swedish eurodance",
	"uk post-punk",
	"vocal house",
	"danspunk",
	"indie garage rock",
	"deep new americana",
	"axe",
	"chanson",
	"melodic death metal",
	"industrial rock",
	"jazz fusion",
	"deep regional mexican",
	"italian hip hop",
	"modern classical",
	"garage psych",
	"classic swedish pop",
	"turkish rock",
	"bebop",
	"post rock",
	"spanish pop rock",
	"deep swedish hip hop",
	"irish rock",
	"dutch pop",
	"movie tunes",
	"post-disco",
	"contemporary post-bop",
	"west coast trap",
	"swedish hip hop",
	"ninja",
	"texas blues",
	"cantopop",
	"blues",
	"dutch house",
	"anthem emo",
	"norwegian pop",
	"chillstep",
	"minimal techno",
	"chilean rock",
	"canadian indie",
	"experimental rock",
	"dutch hip hop",
	"acid jazz",
	"wrestling",
	"melodic hardcore",
	"easy listening",
	"fourth world",
	"progressive bluegrass",
	"microhouse",
	"big beat",
	"norwegian indie",
	"hip house",
	"post-hardcore",
	"vallenato",
	"rock gaucho",
	"broadway",
	"tech house",
	"indonesian pop",
	"traditional blues",
	"electro latino",
	"dreamo",
	"noise rock",
	"aussietronica",
	"french rock",
	"soul jazz",
	"antiviral pop",
	"sheffield indie",
	"australian pop",
	"country blues",
	"french indie pop",
	"swedish indie pop",
	"uplifting trance",
	"uk garage",
	"latin christian",
	"french indietronica",
	"hard bop",
	"swing",
	"country gospel",
	"ambient",
	"azontobeats",
	"russelater",
	"reggae rock",
	"lovers rock",
	"electro swing",
	"mexican indie",
	"epicore",
	"french reggae",
	"neo classical metal",
	"new age",
	"zapstep",
	"celtic rock",
	"turntablism",
	"death metal",
	"latin jazz",
	"industrial",
	"stoner rock"
];

export default data;