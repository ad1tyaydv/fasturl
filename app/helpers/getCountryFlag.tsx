
export const getCountryCode = (country: string): string | null => {
  const map: Record<string, string> = {
    // A
    "afghanistan": "AF",
    "albania": "AL",
    "algeria": "DZ",
    "andorra": "AD",
    "angola": "AO",
    "antigua and barbuda": "AG",
    "argentina": "AR",
    "armenia": "AM",
    "australia": "AU",
    "austria": "AT",
    "azerbaijan": "AZ",

    // B
    "bahamas": "BS",
    "bahrain": "BH",
    "bangladesh": "BD",
    "barbados": "BB",
    "belarus": "BY",
    "belgium": "BE",
    "belize": "BZ",
    "benin": "BJ",
    "bhutan": "BT",
    "bolivia": "BO",
    "bosnia and herzegovina": "BA",
    "botswana": "BW",
    "brazil": "BR",
    "brunei": "BN",
    "bulgaria": "BG",
    "burkina faso": "BF",
    "burundi": "BI",

    // C
    "cambodia": "KH",
    "cameroon": "CM",
    "canada": "CA",
    "cape verde": "CV",
    "central african republic": "CF",
    "chad": "TD",
    "chile": "CL",
    "china": "CN",
    "colombia": "CO",
    "comoros": "KM",
    "congo": "CG",
    "costa rica": "CR",
    "croatia": "HR",
    "cuba": "CU",
    "cyprus": "CY",
    "czech republic": "CZ",

    // D
    "denmark": "DK",
    "djibouti": "DJ",
    "dominica": "DM",
    "dominican republic": "DO",

    // E
    "east timor": "TL",
    "ecuador": "EC",
    "egypt": "EG",
    "el salvador": "SV",
    "equatorial guinea": "GQ",
    "eritrea": "ER",
    "estonia": "EE",
    "ethiopia": "ET",

    // F
    "fiji": "FJ",
    "finland": "FI",
    "france": "FR",

    // G
    "gabon": "GA",
    "gambia": "GM",
    "georgia": "GE",
    "germany": "DE",
    "ghana": "GH",
    "greece": "GR",
    "grenada": "GD",
    "guatemala": "GT",
    "guinea": "GN",
    "guinea-bissau": "GW",
    "guyana": "GY",

    // H
    "haiti": "HT",
    "honduras": "HN",
    "hungary": "HU",

    // I
    "iceland": "IS",
    "india": "IN",
    "indonesia": "ID",
    "iran": "IR",
    "iraq": "IQ",
    "ireland": "IE",
    "israel": "IL",
    "italy": "IT",
    "ivory coast": "CI",

    // J
    "jamaica": "JM",
    "japan": "JP",
    "jordan": "JO",

    // K
    "kazakhstan": "KZ",
    "kenya": "KE",
    "kiribati": "KI",
    "korea, north": "KP",
    "korea, south": "KR",
    "south korea": "KR",
    "north korea": "KP",
    "kuwait": "KW",
    "kyrgyzstan": "KG",

    // L
    "laos": "LA",
    "latvia": "LV",
    "lebanon": "LB",
    "lesotho": "LS",
    "liberia": "LR",
    "libya": "LY",
    "liechtenstein": "LI",
    "lithuania": "LT",
    "luxembourg": "LU",

    // M
    "macedonia": "MK",
    "madagascar": "MG",
    "malawi": "MW",
    "malaysia": "MY",
    "maldives": "MV",
    "mali": "ML",
    "malta": "MT",
    "marshall islands": "MH",
    "mauritania": "MR",
    "mauritius": "MU",
    "mexico": "MX",
    "micronesia": "FM",
    "moldova": "MD",
    "monaco": "MC",
    "mongolia": "MN",
    "montenegro": "ME",
    "morocco": "MA",
    "mozambique": "MZ",
    "myanmar": "MM",

    // N
    "namibia": "NA",
    "nauru": "NR",
    "nepal": "NP",
    "netherlands": "NL",
    "new zealand": "NZ",
    "nicaragua": "NI",
    "niger": "NE",
    "nigeria": "NG",
    "norway": "NO",

    // O
    "oman": "OM",

    // P
    "pakistan": "PK",
    "palau": "PW",
    "panama": "PA",
    "papua new guinea": "PG",
    "paraguay": "PY",
    "peru": "PE",
    "philippines": "PH",
    "poland": "PL",
    "portugal": "PT",

    // Q
    "qatar": "QA",

    // R
    "romania": "RO",
    "russia": "RU",
    "rwanda": "RW",

    // S
    "saint kitts and nevis": "KN",
    "saint lucia": "LC",
    "saint vincent and the grenadines": "VC",
    "samoa": "WS",
    "san marino": "SM",
    "sao tome and principe": "ST",
    "saudi arabia": "SA",
    "senegal": "SN",
    "serbia": "RS",
    "seychelles": "SC",
    "sierra leone": "SL",
    "singapore": "SG",
    "slovakia": "SK",
    "slovenia": "SI",
    "solomon islands": "SB",
    "somalia": "SO",
    "south africa": "ZA",
    "south sudan": "SS",
    "spain": "ES",
    "sri lanka": "LK",
    "sudan": "SD",
    "suriname": "SR",
    "swaziland": "SZ",
    "sweden": "SE",
    "switzerland": "CH",
    "syria": "SY",

    // T
    "taiwan": "TW",
    "tajikistan": "TJ",
    "tanzania": "TZ",
    "thailand": "TH",
    "togo": "TG",
    "tonga": "TO",
    "trinidad and tobago": "TT",
    "tunisia": "TN",
    "turkey": "TR",
    "turkmenistan": "TM",
    "tuvalu": "TV",

    // U
    "uganda": "UG",
    "ukraine": "UA",
    "united arab emirates": "AE",
    "uae": "AE",
    "united kingdom": "GB",
    "uk": "GB",
    "united states": "US",
    "united states of america": "US",
    "usa": "US",
    "uruguay": "UY",
    "uzbekistan": "UZ",

    // V
    "vanuatu": "VU",
    "vatican city": "VA",
    "venezuela": "VE",
    "vietnam": "VN",

    // Y
    "yemen": "YE",

    // Z
    "zambia": "ZM",
    "zimbabwe": "ZW",
  };

  return map[country?.toLowerCase()] || null;
};
