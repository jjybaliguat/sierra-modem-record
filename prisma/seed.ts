import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const response = await prisma.entries.createMany({
    data: [
        {
            raffleCode: "0001",
            clientName: "BARRAMEDA, MEYNARD",
            address: "B3 EXT L186 SV8C",
            phone: "09095406426",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0002",
            clientName: "RUDA, RIZALDY M.",
            address: "B14 L240 SV8C",
            phone: "09662893628",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0003",
            clientName: "PACATANG, EDESA M.",
            address: "B2 L74 1N SV8C",
            phone: "09979752864",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0004",
            clientName: "BOCO, CHERY MAY J.",
            address: "B2 L100 SV8C",
            phone: "09454381130",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0005",
            clientName: "CELEMIN, ANNA MAE",
            address: "ABATEX",
            phone: "09976701277",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0006",
            clientName: "CELEMIN, ANNA MAE",
            address: "ABATEX",
            phone: "09976701277",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0007",
            clientName: "TABSING, HARRIET C.",
            address: "B2 L79 1N SV8C",
            phone: "09367937186",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0008",
            clientName: "OÑEZ, ELSA C.",
            address: "B15 L154 SV8C",
            phone: "09155668921",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0009",
            clientName: "REBECCA V. ORCAJADA",
            address: "B3 EXT L157 SV8C",
            phone: "09814977449/09564401729",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0010",
            clientName: "REBECCA V. ORCAJADA",
            address: "B3 EXT L157 SV8C",
            phone: "09814977449/09564401729",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0011",
            clientName: "ANA PRINCESS F. BAGALANON",
            address: "B2 L68 SV8C",
            phone: "09704578112 / 09510967352",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0012",
            clientName: "GERLIE E. DIOSO",
            address: "B3 L161 PH1N1 SV8C",
            phone: "09156670324 /09952744381",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0013",
            clientName: "ROMMEL TROGO",
            address: "B10 L12A NYLN ST. LTXVL",
            phone: "09487268984/ 09069422319",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0014",
            clientName: "LABIAL, RALPH",
            address: "B22 L79 SV8C",
            phone: "09634335176",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0015",
            clientName: "GELLADO, ANGELO C.",
            address: "LOWER PINATUBO ST.",
            phone: "09152027820",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0016",
            clientName: "ABEJUELA, SARAH JANE R.",
            address: "PAHATI COMP. EMMAUS",
            phone: "09514903577",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0017",
            clientName: "REYES, ROWENA",
            address: "557 N.VALDEZ ST. GERONIMO",
            phone: "09157069028",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0018",
            clientName: "MIRANDA, JAN DANIELA",
            address: "9 N. VALDEZ ST GERONIMO",
            phone: "09070662516",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0019",
            clientName: "MIRANDA, JAN DANIELA",
            address: "9 N. VALDEZ ST GERONIMO",
            phone: "09070662516",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0020",
            clientName: "GARCIA, KEITH MENDOZA",
            address: "B13 L8 IMPERIAL ST LITEXVILL",
            phone: "09774421404 / 09777054945",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0021",
            clientName: "YMAS, JESSICA",
            address: "B3 EXT L76 SV8C",
            phone: "09097964781 / 09099846173",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0022",
            clientName: "YMAS, JESSICA",
            address: "B3 EXT L76 SV8C",
            phone: "09097964781 / 09099846173",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0023",
            clientName: "GUANZON, JERRY YAP",
            address: "B11 L76 SV8C",
            phone: "09159719696 / 09090496747",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0024",
            clientName: "SABORNIDO, DIONE SALE",
            address: "B11 L75 SV8C",
            phone: "09455175951 / 09514924947",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0025",
            clientName: "GERALD R. SALON",
            address: "B13 L55 SV8C",
            phone: "09659076476 /09752936720",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0026",
            clientName: "GERALD R. SALON",
            address: "B13 L55 SV8C",
            phone: "09659076476 /09752936720",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0027",
            clientName: "MARIVIC BARCELO",
            address: "B1 L6 SV8C ",
            phone: "09701580021 /09308115752",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0028",
            clientName: "ALVIN P. MC ARTHUR",
            address: "B11 L61 SV8C",
            phone: "09993936608/09124669925",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0029",
            clientName: "TERESITA F. ZABALA",
            address: "B14 L359 SV8C",
            phone: "09630127560",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0030",
            clientName: "MARY JOYCE BONDOC",
            address: "B21 L22 SV8C",
            phone: "09948248832/09304983930",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0031",
            clientName: "RONALD MEDINA",
            address: "B9 L37 SV8C",
            phone: "09073857853 /09854827103",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0032",
            clientName: "RONALD MEDINA",
            address: "B9 L37 SV8C",
            phone: "09073857853 /09854827103",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0033",
            clientName: "QUEMADA, ELBIE A.",
            address: "B18 L220 SV8C ",
            phone: "09318246343",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0034",
            clientName: "QUEMADA, ELBIE A.",
            address: "B18 L220 SV8C ",
            phone: "09318246343",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0035",
            clientName: "ROJO, LILIAN CANALES",
            address: "B21 L36 SV8C",
            phone: "09978997611",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0036",
            clientName: "GUTIERREZ, EDMUNDO C.",
            address: "RAMITEX ST. LITEX VILL",
            phone: "09056718758",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0037",
            clientName: "CINDY NOCALAN",
            address: "B8 L61 SV8C",
            phone: "09451442238 /09261669436",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0038",
            clientName: "CINDY NOCALAN",
            address: "B8 L61 SV8C",
            phone: "09451442238 /09261669436",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0039",
            clientName: "SUMALDE GLORIA A.",
            address: "B6 L157 SV8C",
            phone: "09197557892 /09488897444",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0040",
            clientName: "SUMALDE GLORIA A.",
            address: "B6 L157 SV8C",
            phone: "09197557892 /09488897444",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0041",
            clientName: "ROQUE V. MAGUSIB",
            address: "B18 L1 SV8C",
            phone: "09356394395/09677530772",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0042",
            clientName: "RUTHILYN ROSAL",
            address: "B14 L115 PH1N SV8C",
            phone: "09368063959",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0043",
            clientName: "ROTILO, LUTH ERALINO",
            address: "B3 L67 Double L Luma",
            phone: "09603742926",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0044",
            clientName: "PAGDINGALAN, JOY BENITEZ",
            address: "B2 L45 SV8C",
            phone: "09301575338",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0045",
            clientName: "MARAMAG JR, FELIX A.",
            address: "B18 L45 SV8C",
            phone: "09283019263",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0046",
            clientName: "ERMINO, ELMA",
            address: "B2 L87 SV8C",
            phone: "09614487216",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0047",
            clientName: "JAELLA TAMAYO MENESES",
            address: "B3 L202 SV8C",
            phone: "09297560941 / 09851227499",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0048",
            clientName: "MARCO MARVIN DC",
            address: "160 HILLTOP ABTX",
            phone: "09077661413 /09485566622",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0049",
            clientName: "MARCO MARVIN DC",
            address: "160 HILLTOP ABTX",
            phone: "09077661413 /09485566622",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0050",
            clientName: "PASCUA, FE DONATA V.",
            address: "B9 L64 PH1A SUB URBAN",
            phone: "09163257382",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0051",
            clientName: "PASCUA, FE DONATA V.",
            address: "B9 L64 PH1A SUB URBAN",
            phone: "09163257382",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0052",
            clientName: "MAMAUAG, JOSE GEORGE M.",
            address: "127 DAO ST SAN JOSE",
            phone: "09150694267",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0053",
            clientName: "MAMAUAG, JOSE GEORGE M.",
            address: "127 DAO ST SAN JOSE",
            phone: "09150694267",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0054",
            clientName: "ABUDA, JOEL VELASCO",
            address: "B3 L25 PH1A SUBURBAN/B7 L24 PH1A SUB-URBAN",
            phone: "09661666085 /Crispy Bacon",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0055",
            clientName: "ABUDA, JOEL VELASCO",
            address: "B3 L25 PH1A SUBURBAN/B7 L24 PH1A SUB-URBAN",
            phone: "09661666085 /Crispy Bacon",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0056",
            clientName: "SAGONOY, CHARNIZA O.",
            address: "B12 L21 SV8C",
            phone: "09453162516 / 09568093329",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0057",
            clientName: "SAGONOY, CHARNIZA O.",
            address: "B12 L21 SV8C",
            phone: "09453162516 / 09568093329",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0058",
            clientName: "CREDO, EDWIN S.",
            address: "B1 L38 PH1A SUBURBAN",
            phone: "09396120542/09852126286",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0059",
            clientName: "CREDO, EDWIN S.",
            address: "B1 L38 PH1A SUBURBAN",
            phone: "09396120542/09852126286",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0060",
            clientName: "ALIPE, ELIZA",
            address: "B11 L99 SV8C",
            phone: "09107625098/09261179550",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0061",
            clientName: "PALOMER, BENJIE VISTA",
            address: "B3 EXT L89 SV8C",
            phone: "09274634255",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0062",
            clientName: "PALOMER, BENJIE VISTA",
            address: "B3 EXT L89 SV8C",
            phone: "09274634255",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0063",
            clientName: "TARUN, JEN MARIE",
            address: "B2 L154 DOUBLE L LUMA",
            phone: "09557901758",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0064",
            clientName: "EVALAROSA, MARIZEL",
            address: "Block 3 ext Lot 55 SV8C",
            phone: "09068091093",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0065",
            clientName: "MICHELLE G. CALALAS",
            address: "B15 L139 SV8C",
            phone: "09389048810/09063963918",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0066",
            clientName: "EVALAROSA, MARIZEL",
            address: "Block 3 ext Lot 55 SV8C",
            phone: "09068091093",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0067",
            clientName: "MICHELLE G. CALALAS",
            address: "B15 L139 SV8C",
            phone: "09389048810/09063963918",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0068",
            clientName: "TARUN, JEN MARIE",
            address: "B2 L154 DOUBLE L LUMA",
            phone: "09557901758",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0069",
            clientName: "CLIDORO, JAEMIE ANN",
            address: "HILLTOP ABATEX",
            phone: "09121398771",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0070",
            clientName: "CLIDORO, JAEMIE ANN",
            address: "HILLTOP ABATEX",
            phone: "09121398771",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0071",
            clientName: "FRONDA, EDNA D.",
            address: "B5 L18 Ramitex St. Litex Village",
            phone: "09989526828",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0072",
            clientName: "FRONDA, EDNA D.",
            address: "B5 L18 Ramitex St. Litex Village",
            phone: "09989526828",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0073",
            clientName: "ABDULRAKMAN, DAYAGANON, PAGARI GUINAR",
            address: "B2 L72 DOUBLEL LUMA",
            phone: "09198562807 / 09066635807",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0074",
            clientName: "ABDULRAKMAN, DAYAGANON, PAGARI GUINAR",
            address: "B2 L72 DOUBLEL LUMA",
            phone: "09198562807 / 09066635807",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0075",
            clientName: "BALMADRID, SHARMAINE V.",
            address: "B10 L11 NYLON ST LITEX VILL",
            phone: "09260471962",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0076",
            clientName: "BALMADRID, SHARMAINE V.",
            address: "B10 L11 NYLON ST LITEX VILL",
            phone: "09260471962",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0077",
            clientName: "LEA LEIGH MANICANE",
            address: "B4 L12 LITTON ST. LITEX VILL",
            phone: "09303995466/09677447662",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0078",
            clientName: "LEA LEIGH MANICANE",
            address: "B4 L12 LITTON ST. LITEX VILL",
            phone: "09303995466/09677447662",
            branchId: "66d6974c6a260eaa5204b0a5"
        },
        {
            raffleCode: "0079",
            clientName: "ROQUE, CATHERINE M.",
            address: "B8 L56 SV8C",
            phone: "09171394550",
            branchId: "66d6974c6a260eaa5204b0a5"
        }
    ]
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })