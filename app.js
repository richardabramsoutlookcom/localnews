// App state
let currentLocation = {
    lat: 55.7789,
    lng: -4.3194,
    name: 'Newton Mearns',
    postcode: 'G77 5PG'
};
let currentRadius = 10;
let currentCategory = 'all';

// Weather emoji mapping
const weatherIcons = {
    0: '☀️',      // Clear sky
    1: '🌤️',      // Mainly clear
    2: '⛅',      // Partly cloudy
    3: '☁️',      // Overcast
    45: '🌫️',     // Fog
    48: '🌫️',     // Depositing rime fog
    51: '🌦️',     // Light drizzle
    53: '🌦️',     // Moderate drizzle
    55: '🌧️',     // Dense drizzle
    56: '🌨️',     // Light freezing drizzle
    57: '🌨️',     // Dense freezing drizzle
    61: '🌧️',     // Slight rain
    63: '🌧️',     // Moderate rain
    65: '🌧️',     // Heavy rain
    66: '🌨️',     // Light freezing rain
    67: '🌨️',     // Heavy freezing rain
    71: '🌨️',     // Slight snow
    73: '🌨️',     // Moderate snow
    75: '❄️',      // Heavy snow
    77: '🌨️',     // Snow grains
    80: '🌦️',     // Slight rain showers
    81: '🌧️',     // Moderate rain showers
    82: '⛈️',      // Violent rain showers
    85: '🌨️',     // Slight snow showers
    86: '❄️',      // Heavy snow showers
    95: '⛈️',      // Thunderstorm
    96: '⛈️',      // Thunderstorm with slight hail
    99: '⛈️'       // Thunderstorm with heavy hail
};

const weatherDescriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Freezing rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light showers',
    81: 'Showers',
    82: 'Heavy showers',
    85: 'Snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Severe thunderstorm'
};

// UK Postcode coordinates lookup (common Glasgow area postcodes)
const postcodeCoordinates = {
    'G77': { lat: 55.7789, lng: -4.3194, name: 'Newton Mearns' },
    'G77 5': { lat: 55.7789, lng: -4.3194, name: 'Newton Mearns' },
    'G77 6': { lat: 55.7750, lng: -4.3100, name: 'Newton Mearns' },
    'G76': { lat: 55.7898, lng: -4.2756, name: 'Clarkston' },
    'G46': { lat: 55.8052, lng: -4.2946, name: 'Giffnock' },
    'G43': { lat: 55.8281, lng: -4.2854, name: 'Shawlands' },
    'G44': { lat: 55.8150, lng: -4.2600, name: 'Cathcart' },
    'G41': { lat: 55.8350, lng: -4.2700, name: 'Pollokshields' },
    'G42': { lat: 55.8400, lng: -4.2600, name: 'Queens Park' },
    'G45': { lat: 55.8100, lng: -4.2200, name: 'Castlemilk' },
    'G78': { lat: 55.8010, lng: -4.3890, name: 'Barrhead' },
    'G1': { lat: 55.8609, lng: -4.2514, name: 'Glasgow City Centre' },
    'G2': { lat: 55.8620, lng: -4.2580, name: 'Glasgow City Centre' },
    'G3': { lat: 55.8680, lng: -4.2800, name: 'West End' },
    'G4': { lat: 55.8700, lng: -4.2500, name: 'Cowcaddens' },
    'G5': { lat: 55.8480, lng: -4.2550, name: 'Gorbals' },
    'G11': { lat: 55.8720, lng: -4.3100, name: 'Partick' },
    'G12': { lat: 55.8780, lng: -4.2950, name: 'Hillhead' },
    'G13': { lat: 55.8900, lng: -4.3400, name: 'Knightswood' },
    'G14': { lat: 55.8750, lng: -4.3500, name: 'Scotstoun' },
    'G51': { lat: 55.8580, lng: -4.3200, name: 'Govan' },
    'G52': { lat: 55.8500, lng: -4.3600, name: 'Hillington' },
    'G53': { lat: 55.8200, lng: -4.3500, name: 'Pollok' }
};

// News data with locations
const newsData = [
    {
        id: 1,
        title: "Pavement Parking Ban Enforcement Begins",
        content: "East Renfrewshire Council has begun enforcement of the pavement parking ban from 5 January 2026. Drivers parking on pavements may now face fines. The ban aims to improve accessibility for wheelchair users and those with pushchairs.",
        location: "Newton Mearns",
        lat: 55.7714,
        lng: -4.3326,
        category: "council",
        source: "Barrhead News",
        sourceUrl: "https://www.barrheadnews.com/",
        date: "2026-01-05"
    },
    {
        id: 2,
        title: "Motorbike Theft and Arson at Auldhouse Park",
        content: "A motorbike was stolen and set on fire at Auldhouse Park around 7:30pm on January 4th. Police are appealing for witnesses and anyone with CCTV footage of the area to come forward.",
        location: "Auldhouse",
        lat: 55.8050,
        lng: -4.2900,
        category: "crime",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/news/crime",
        date: "2026-01-04"
    },
    {
        id: 3,
        title: "New Care Home Construction Underway in Clarkston",
        content: "Work is progressing on a new 50-bedroom state-of-the-art care home in Clarkston. The project is a joint venture between Morrison Community Care Group and CCG Scotland, following the completed land purchase from Greenbank Parish Church.",
        location: "Clarkston",
        lat: 55.7898,
        lng: -4.2756,
        category: "community",
        source: "Scottish Construction Now",
        sourceUrl: "https://www.scottishconstructionnow.com/",
        date: "2026-01-10"
    },
    {
        id: 4,
        title: "Legends of American Country Show at Eastwood Park Theatre",
        content: "Europe's 'number one country music tribute' is coming to Giffnock. The Legends of American Country show features music from Dolly Parton, Johnny Cash, Patsy Cline, and more at Eastwood Park Theatre on Wednesday, January 7 from 7:30pm.",
        location: "Giffnock",
        lat: 55.8052,
        lng: -4.2946,
        category: "events",
        source: "Barrhead News",
        sourceUrl: "https://www.barrheadnews.com/news/25710969.legends-american-country-tribute-show-coming-giffnock/",
        date: "2026-01-07"
    },
    {
        id: 5,
        title: "Royal Ballet's La Traviata Screening",
        content: "A screening of the Royal Ballet and Opera's La Traviata will take place at Eastwood Park Theatre on Wednesday 14th January. Book tickets in advance.",
        location: "Giffnock",
        lat: 55.8052,
        lng: -4.2946,
        category: "events",
        source: "What's On East Renfrewshire",
        sourceUrl: "https://www.whatsoneastrenfrewshire.co.uk/",
        date: "2026-01-14"
    },
    {
        id: 6,
        title: "Break-ins Reported in Shawlands and Pollokshaws Gardens",
        content: "Residents are warned about a man breaking into back gardens in the Shawlands and Pollokshaws area to steal items. Police advise securing garden sheds and reporting suspicious activity.",
        location: "Shawlands",
        lat: 55.8281,
        lng: -4.2854,
        category: "crime",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/topic/glasgow-southside",
        date: "2026-01-12"
    },
    {
        id: 7,
        title: "Head Teacher Honoured for Newton Mearns Volunteer Work",
        content: "Gillian Caldwell, who has been volunteering since 1977, was named in the New Year Honours list for her outstanding community service in Newton Mearns. The head teacher expressed 'disbelief' at the recognition.",
        location: "Newton Mearns",
        lat: 55.7714,
        lng: -4.3326,
        category: "community",
        source: "Mearns News",
        sourceUrl: "https://www.mearnsnews.com/",
        date: "2026-01-01"
    },
    {
        id: 8,
        title: "A77 Landscape Maintenance Works",
        content: "Landscape maintenance works have begun on the A77 northbound from the A76/A71 junction to M77 boundary. Started 5th January 2026 at 9:00am. No major carriageway obstructions expected.",
        location: "A77 (Near Newton Mearns)",
        lat: 55.7600,
        lng: -4.3400,
        category: "traffic",
        source: "Traffic Scotland",
        sourceUrl: "https://www.traffic.gov.scot/",
        date: "2026-01-05"
    },
    {
        id: 9,
        title: "McDonald's Temporarily Closed After Pest Sighting",
        content: "The McDonald's restaurant on Pollokshaws Road has temporarily closed following a pest sighting. Pest control experts are currently working to ensure the premises is safe to reopen.",
        location: "Pollokshaws Road",
        lat: 55.8300,
        lng: -4.2700,
        category: "business",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/",
        date: "2026-01-13"
    },
    {
        id: 10,
        title: "Aurs Road Improvement Project Update",
        content: "East Renfrewshire Council has confirmed a revised estimated completion date of spring 2026 for the Aurs Road improvement project. The roadworks have been ongoing to improve traffic flow and safety.",
        location: "Barrhead",
        lat: 55.8010,
        lng: -4.3890,
        category: "council",
        source: "Barrhead News",
        sourceUrl: "https://www.barrheadnews.com/",
        date: "2026-01-08"
    },
    {
        id: 11,
        title: "Atmospheric Landscape Painting Workshop",
        content: "The Wee Art Studio in Clarkston is hosting an atmospheric landscape painting workshop on Sunday 25th January. Perfect for beginners and experienced painters alike.",
        location: "Clarkston",
        lat: 55.7898,
        lng: -4.2756,
        category: "events",
        source: "What's On East Renfrewshire",
        sourceUrl: "https://www.whatsoneastrenfrewshire.co.uk/",
        date: "2026-01-25"
    },
    {
        id: 12,
        title: "MSP Criticises 'Vague' A77 Upgrade Commitments",
        content: "A local MSP has criticised the Scottish Government over a transport review which provides 'vague commitments' to upgrade the A77. The road is a vital link between Glasgow and South West Scotland, serving Newton Mearns, Kilmarnock, and Ayr.",
        location: "A77 Corridor",
        lat: 55.7500,
        lng: -4.3500,
        category: "council",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/",
        date: "2026-01-09"
    },
    {
        id: 13,
        title: "Bus Crash Into Newton Mearns House",
        content: "An ARG Travel bus crashed into the front of a house in Newton Mearns. The bus was filmed being removed from the property on Thursday evening. No serious injuries reported.",
        location: "Newton Mearns",
        lat: 55.7750,
        lng: -4.3200,
        category: "traffic",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/",
        date: "2026-01-10"
    },
    {
        id: 14,
        title: "Dessert Shop AFTRS Rebranding as Urban West",
        content: "The dessert shop AFTRS on Pollokshaws Road in Shawlands is closing and rebranding as Urban West. Local residents are curious to see what the new concept will offer.",
        location: "Shawlands",
        lat: 55.8281,
        lng: -4.2854,
        category: "business",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/",
        date: "2026-01-11"
    },
    {
        id: 15,
        title: "Cafe Yaro Opens on Pollokshaws Road",
        content: "Yash Trikha and Roshan Robert have opened their first business, Cafe Yaro, on Pollokshaws Road. The entrepreneurs are determined to make it a success despite cost of living pressures.",
        location: "Pollokshaws Road",
        lat: 55.8300,
        lng: -4.2700,
        category: "business",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/",
        date: "2026-01-06"
    },
    {
        id: 16,
        title: "Bomb Squad Called to Newton Mearns Property",
        content: "A Newton Mearns home was sealed off by police over fears of 'explosives inside' as the bomb squad attended. Residents of several neighbouring properties at Pilmuir Holdings were evacuated during the incident.",
        location: "Newton Mearns (Pilmuir Holdings)",
        lat: 55.7680,
        lng: -4.3100,
        category: "crime",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/news/crime",
        date: "2026-01-08"
    },
    {
        id: 17,
        title: "Giffnock Litter Pickers Saturday Sessions",
        content: "The Giffnock Litter Pickers continue their Saturday morning sessions through the year, helping remove litter from local streets. New volunteers are always welcome to join.",
        location: "Giffnock",
        lat: 55.8052,
        lng: -4.2946,
        category: "community",
        source: "What's On East Renfrewshire",
        sourceUrl: "https://www.whatsoneastrenfrewshire.co.uk/",
        date: "2026-01-15"
    },
    {
        id: 18,
        title: "M8 Kingston Bridge Overnight Roadworks Continue",
        content: "Overnight roadworks and road closures continue on the Kingston Bridge and surrounding M8 approach roads. Part of a major bridge refurbishment project running until Spring 2026.",
        location: "Kingston Bridge (Glasgow)",
        lat: 55.8580,
        lng: -4.2730,
        category: "traffic",
        source: "Traffic Scotland",
        sourceUrl: "https://www.traffic.gov.scot/",
        date: "2026-01-14"
    },
    {
        id: 19,
        title: "Commonwealth Games Coming to Glasgow 2026",
        content: "Glasgow welcomes the Commonwealth Games in summer 2026, introducing new events like WOMAD Festival. The city is preparing for an influx of athletes and visitors from around the world.",
        location: "Glasgow City Centre",
        lat: 55.8609,
        lng: -4.2514,
        category: "events",
        source: "Glasgow World",
        sourceUrl: "https://www.glasgowworld.com/",
        date: "2026-01-02"
    },
    {
        id: 20,
        title: "Assault Outside Hampden - Man Charged",
        content: "A 22-year-old man was arrested and charged after a 51-year-old woman was assaulted and had a St Johnstone supporters drum taken from her outside Hampden Stadium.",
        location: "Hampden",
        lat: 55.8258,
        lng: -4.2520,
        category: "crime",
        source: "Police Scotland",
        sourceUrl: "https://www.scotland.police.uk/",
        date: "2026-01-12"
    },
    // EDINBURGH
    {
        id: 21,
        title: "Edinburgh Tram Extension Opens to Newhaven",
        content: "The new Edinburgh tram extension to Newhaven is now fully operational, connecting Leith and the waterfront to the city centre. Journey times from Newhaven to the airport are approximately 35 minutes.",
        location: "Newhaven, Edinburgh",
        lat: 55.9785,
        lng: -3.1883,
        category: "traffic",
        source: "Edinburgh Evening News",
        sourceUrl: "https://www.edinburghnews.scotsman.com/",
        date: "2026-01-08"
    },
    {
        id: 22,
        title: "Royal Mile Street Performers Face New Licensing Rules",
        content: "Edinburgh Council has introduced new licensing requirements for buskers and street performers on the Royal Mile. Performers must now register and adhere to designated performance zones.",
        location: "Royal Mile, Edinburgh",
        lat: 55.9502,
        lng: -3.1875,
        category: "council",
        source: "Edinburgh Evening News",
        sourceUrl: "https://www.edinburghnews.scotsman.com/",
        date: "2026-01-10"
    },
    {
        id: 23,
        title: "Stockbridge Market Celebrates 10th Anniversary",
        content: "The popular Stockbridge Sunday Market is celebrating its 10th anniversary with special events throughout January. Local artisans and food vendors will offer exclusive anniversary deals.",
        location: "Stockbridge, Edinburgh",
        lat: 55.9580,
        lng: -3.2130,
        category: "events",
        source: "The Scotsman",
        sourceUrl: "https://www.scotsman.com/",
        date: "2026-01-12"
    },
    // LONDON
    {
        id: 24,
        title: "Elizabeth Line Ridership Hits Record Numbers",
        content: "The Elizabeth Line has reported record passenger numbers over the Christmas period, with over 700,000 journeys made on Boxing Day alone. TfL credits the line's success with transforming east-west travel across London.",
        location: "Liverpool Street, London",
        lat: 51.5178,
        lng: -0.0823,
        category: "traffic",
        source: "Evening Standard",
        sourceUrl: "https://www.standard.co.uk/",
        date: "2026-01-05"
    },
    {
        id: 25,
        title: "Camden Market Fire - Investigation Ongoing",
        content: "Fire investigators continue to examine the cause of a blaze that damaged several stalls at Camden Market last weekend. No injuries were reported but traders face weeks of disruption.",
        location: "Camden, London",
        lat: 51.5416,
        lng: -0.1461,
        category: "crime",
        source: "London Fire Brigade",
        sourceUrl: "https://www.london-fire.gov.uk/",
        date: "2026-01-09"
    },
    {
        id: 26,
        title: "Brixton Village Gets New Community Garden",
        content: "A disused courtyard in Brixton Village has been transformed into a community garden. Local volunteers spent six months creating the urban oasis, which features native plants and a rainwater harvesting system.",
        location: "Brixton, London",
        lat: 51.4613,
        lng: -0.1146,
        category: "community",
        source: "Brixton Blog",
        sourceUrl: "https://brixtonblog.com/",
        date: "2026-01-11"
    },
    {
        id: 27,
        title: "Shoreditch Tech Hub Announces 500 New Jobs",
        content: "A major fintech company is expanding its Shoreditch headquarters, creating 500 new jobs over the next two years. The expansion includes a new training academy for local residents.",
        location: "Shoreditch, London",
        lat: 51.5256,
        lng: -0.0775,
        category: "business",
        source: "City AM",
        sourceUrl: "https://www.cityam.com/",
        date: "2026-01-14"
    },
    {
        id: 28,
        title: "Greenwich Observatory Free Entry Weekend",
        content: "The Royal Observatory Greenwich is offering free entry this weekend as part of a new initiative to boost winter tourism. Visitors can explore the historic site and stand on the Prime Meridian line.",
        location: "Greenwich, London",
        lat: 51.4769,
        lng: -0.0005,
        category: "events",
        source: "Time Out London",
        sourceUrl: "https://www.timeout.com/london",
        date: "2026-01-15"
    },
    // MANCHESTER
    {
        id: 29,
        title: "Northern Quarter Independent Shops Rally",
        content: "Independent shop owners in Manchester's Northern Quarter have launched a 'Shop Local' campaign to counter the rise of chain stores. The initiative includes late-night shopping events and collaborative promotions.",
        location: "Northern Quarter, Manchester",
        lat: 53.4839,
        lng: -2.2353,
        category: "business",
        source: "Manchester Evening News",
        sourceUrl: "https://www.manchestereveningnews.co.uk/",
        date: "2026-01-07"
    },
    {
        id: 30,
        title: "Metrolink Expansion to Stockport Approved",
        content: "Greater Manchester Combined Authority has approved plans to extend the Metrolink tram network to Stockport town centre. Construction is expected to begin in late 2026.",
        location: "Stockport",
        lat: 53.4106,
        lng: -2.1575,
        category: "council",
        source: "Manchester Evening News",
        sourceUrl: "https://www.manchestereveningnews.co.uk/",
        date: "2026-01-13"
    },
    {
        id: 31,
        title: "Salford Quays New Year Fireworks Display Review",
        content: "Thousands gathered at Salford Quays for the spectacular New Year's Eve fireworks display. Organisers report it was the largest turnout in the event's history.",
        location: "Salford Quays, Manchester",
        lat: 53.4711,
        lng: -2.2974,
        category: "events",
        source: "Salford Now",
        sourceUrl: "https://www.salfordnow.co.uk/",
        date: "2026-01-02"
    },
    // BIRMINGHAM
    {
        id: 32,
        title: "Bullring Shopping Centre Security Increased",
        content: "Security measures at the Bullring shopping centre have been enhanced following a series of shoplifting incidents. New CCTV cameras and additional security personnel have been deployed.",
        location: "Bullring, Birmingham",
        lat: 52.4774,
        lng: -1.8940,
        category: "crime",
        source: "Birmingham Mail",
        sourceUrl: "https://www.birminghammail.co.uk/",
        date: "2026-01-10"
    },
    {
        id: 33,
        title: "HS2 Curzon Street Station Construction Update",
        content: "Construction of the new HS2 Curzon Street station in Birmingham is progressing on schedule. The station's distinctive curved roof structure is now visible, with completion expected in 2028.",
        location: "Curzon Street, Birmingham",
        lat: 52.4797,
        lng: -1.8862,
        category: "traffic",
        source: "HS2",
        sourceUrl: "https://www.hs2.org.uk/",
        date: "2026-01-11"
    },
    {
        id: 34,
        title: "Digbeth Arts Quarter Festival Announced",
        content: "A new arts festival celebrating Digbeth's creative community will take place in February. The week-long event features exhibitions, live music, and open studios across the historic industrial area.",
        location: "Digbeth, Birmingham",
        lat: 52.4750,
        lng: -1.8810,
        category: "events",
        source: "Birmingham Live",
        sourceUrl: "https://www.birminghamlive.co.uk/",
        date: "2026-01-08"
    },
    // LIVERPOOL
    {
        id: 35,
        title: "Baltic Triangle Noise Complaints Lead to Venue Review",
        content: "Liverpool Council is reviewing licensing for Baltic Triangle venues following ongoing noise complaints from new residential developments. Venue owners argue the area's nightlife predates the housing.",
        location: "Baltic Triangle, Liverpool",
        lat: 53.3942,
        lng: -2.9857,
        category: "council",
        source: "Liverpool Echo",
        sourceUrl: "https://www.liverpoolecho.co.uk/",
        date: "2026-01-09"
    },
    {
        id: 36,
        title: "Albert Dock Winter Ice Rink Extended",
        content: "Due to popular demand, the Albert Dock ice rink will remain open until the end of January. The waterfront attraction has welcomed over 50,000 skaters since November.",
        location: "Albert Dock, Liverpool",
        lat: 53.4001,
        lng: -2.9916,
        category: "events",
        source: "Liverpool Echo",
        sourceUrl: "https://www.liverpoolecho.co.uk/",
        date: "2026-01-06"
    },
    // LEEDS
    {
        id: 37,
        title: "Leeds Kirkgate Market Renovation Complete",
        content: "The historic Kirkgate Market has unveiled its newly renovated food hall, featuring local vendors and a new seating area. The Victorian market is one of Europe's largest covered markets.",
        location: "Kirkgate, Leeds",
        lat: 53.7966,
        lng: -1.5399,
        category: "business",
        source: "Yorkshire Evening Post",
        sourceUrl: "https://www.yorkshireeveningpost.co.uk/",
        date: "2026-01-12"
    },
    {
        id: 38,
        title: "Headingley Stadium Concert Series Announced",
        content: "Headingley Stadium has announced its summer concert lineup, featuring major international artists. Tickets go on sale next week, with early bird discounts for Yorkshire residents.",
        location: "Headingley, Leeds",
        lat: 53.8196,
        lng: -1.5822,
        category: "events",
        source: "Leeds Live",
        sourceUrl: "https://www.leeds-live.co.uk/",
        date: "2026-01-14"
    },
    // BRISTOL
    {
        id: 39,
        title: "Clifton Suspension Bridge Celebrates 160th Anniversary",
        content: "Special events are planned throughout 2026 to mark the 160th anniversary of the Clifton Suspension Bridge. A new visitor centre will open in the spring showcasing Brunel's engineering legacy.",
        location: "Clifton, Bristol",
        lat: 51.4545,
        lng: -2.6276,
        category: "events",
        source: "Bristol Post",
        sourceUrl: "https://www.bristolpost.co.uk/",
        date: "2026-01-05"
    },
    {
        id: 40,
        title: "St Nicholas Market Traders Fear Rent Increases",
        content: "Traders at Bristol's historic St Nicholas Market have expressed concerns over proposed rent increases. A petition calling for affordable rents has gathered over 5,000 signatures.",
        location: "St Nicholas Market, Bristol",
        lat: 51.4535,
        lng: -2.5936,
        category: "business",
        source: "Bristol 24/7",
        sourceUrl: "https://www.bristol247.com/",
        date: "2026-01-11"
    },
    // NEWCASTLE
    {
        id: 41,
        title: "Quayside Sunday Market Returns",
        content: "Newcastle's popular Quayside Sunday Market has returned after a winter break. Over 150 stalls offer local produce, crafts, and street food along the River Tyne.",
        location: "Quayside, Newcastle",
        lat: 54.9698,
        lng: -1.6034,
        category: "events",
        source: "Chronicle Live",
        sourceUrl: "https://www.chroniclelive.co.uk/",
        date: "2026-01-12"
    },
    {
        id: 42,
        title: "St James' Park Expansion Plans Submitted",
        content: "Newcastle United has submitted plans to expand St James' Park to 62,000 seats. The proposal includes improved accessibility and a new fan zone area.",
        location: "St James' Park, Newcastle",
        lat: 54.9756,
        lng: -1.6217,
        category: "business",
        source: "Newcastle Chronicle",
        sourceUrl: "https://www.chroniclelive.co.uk/",
        date: "2026-01-10"
    },
    // CARDIFF
    {
        id: 43,
        title: "Cardiff Bay Barrage 25th Anniversary",
        content: "Cardiff Bay celebrates 25 years since the barrage created the freshwater lake. Special boat tours and exhibitions will run throughout the year highlighting the transformation of the area.",
        location: "Cardiff Bay",
        lat: 51.4637,
        lng: -3.1634,
        category: "events",
        source: "Wales Online",
        sourceUrl: "https://www.walesonline.co.uk/",
        date: "2026-01-08"
    },
    {
        id: 44,
        title: "Principality Stadium Hosts International Rugby",
        content: "The Six Nations kicks off with Wales hosting England at the Principality Stadium. Road closures and additional public transport services are in place for match day.",
        location: "Principality Stadium, Cardiff",
        lat: 51.4782,
        lng: -3.1826,
        category: "events",
        source: "WRU",
        sourceUrl: "https://www.wru.wales/",
        date: "2026-01-15"
    },
    // BELFAST
    {
        id: 45,
        title: "Titanic Quarter Development Phase 2 Begins",
        content: "The second phase of the Titanic Quarter development has commenced, including new residential towers and a creative industries hub. The area continues to transform around the iconic Titanic Museum.",
        location: "Titanic Quarter, Belfast",
        lat: 54.6081,
        lng: -5.9094,
        category: "business",
        source: "Belfast Telegraph",
        sourceUrl: "https://www.belfasttelegraph.co.uk/",
        date: "2026-01-07"
    },
    {
        id: 46,
        title: "Cathedral Quarter Arts Festival Dates Announced",
        content: "Belfast's Cathedral Quarter Arts Festival will return in May with an expanded programme. Early bird tickets are now available for headline performances.",
        location: "Cathedral Quarter, Belfast",
        lat: 54.6022,
        lng: -5.9266,
        category: "events",
        source: "Belfast Live",
        sourceUrl: "https://www.belfastlive.co.uk/",
        date: "2026-01-13"
    },
    // ABERDEEN
    {
        id: 47,
        title: "Aberdeen Beach Esplanade Regeneration",
        content: "Work begins on the £100m regeneration of Aberdeen Beach Esplanade. The project includes new leisure facilities, improved public spaces, and flood defences.",
        location: "Aberdeen Beach",
        lat: 57.1497,
        lng: -2.0783,
        category: "council",
        source: "Press and Journal",
        sourceUrl: "https://www.pressandjournal.co.uk/",
        date: "2026-01-09"
    },
    {
        id: 48,
        title: "Union Street Pedestrianisation Trial",
        content: "Aberdeen City Council is trialling pedestrianisation of a section of Union Street on weekends. Local businesses report mixed reactions to the initiative.",
        location: "Union Street, Aberdeen",
        lat: 57.1453,
        lng: -2.0989,
        category: "traffic",
        source: "Evening Express",
        sourceUrl: "https://www.eveningexpress.co.uk/",
        date: "2026-01-11"
    },
    // DUNDEE
    {
        id: 49,
        title: "V&A Dundee Breaks Visitor Records",
        content: "V&A Dundee has announced record visitor numbers for 2025, with over 500,000 people visiting the waterfront museum. A major new exhibition opens in February.",
        location: "V&A Dundee",
        lat: 56.4577,
        lng: -2.9668,
        category: "events",
        source: "The Courier",
        sourceUrl: "https://www.thecourier.co.uk/",
        date: "2026-01-06"
    },
    {
        id: 50,
        title: "Dundee Waterfront Eden Project Plans",
        content: "Plans for an Eden Project attraction at Dundee Waterfront have moved forward with a new funding commitment. The eco-attraction could open by 2029.",
        location: "Dundee Waterfront",
        lat: 56.4570,
        lng: -2.9650,
        category: "business",
        source: "The Courier",
        sourceUrl: "https://www.thecourier.co.uk/",
        date: "2026-01-14"
    },
    // INVERNESS
    {
        id: 51,
        title: "Inverness Castle Transformation Opens",
        content: "The transformed Inverness Castle is now open to the public as a world-class visitor attraction. The Spirit of the Highlands experience offers panoramic views and interactive exhibits.",
        location: "Inverness Castle",
        lat: 57.4770,
        lng: -4.2253,
        category: "events",
        source: "Highland News",
        sourceUrl: "https://www.highland-news.co.uk/",
        date: "2026-01-05"
    },
    {
        id: 52,
        title: "A9 Dualling Works Resume After Winter Break",
        content: "Dualling works on the A9 between Inverness and Perth have resumed after the Christmas break. Drivers are advised to expect delays and follow diversion signs.",
        location: "A9 (Inverness)",
        lat: 57.4600,
        lng: -4.2100,
        category: "traffic",
        source: "Transport Scotland",
        sourceUrl: "https://www.transport.gov.scot/",
        date: "2026-01-08"
    },
    // YORK
    {
        id: 53,
        title: "York Minster Restoration Fund Reaches Target",
        content: "The York Minster restoration fund has reached its £5m target thanks to donations from around the world. Essential stonework repairs will begin in the spring.",
        location: "York Minster",
        lat: 53.9620,
        lng: -1.0818,
        category: "community",
        source: "York Press",
        sourceUrl: "https://www.yorkpress.co.uk/",
        date: "2026-01-12"
    },
    {
        id: 54,
        title: "Shambles Named Best Street in Britain Again",
        content: "York's historic Shambles has been voted Britain's best street for the third year running. The medieval shopping street attracts millions of visitors annually.",
        location: "The Shambles, York",
        lat: 53.9594,
        lng: -1.0795,
        category: "business",
        source: "Visit York",
        sourceUrl: "https://www.visityork.org/",
        date: "2026-01-10"
    },
    // BATH
    {
        id: 55,
        title: "Roman Baths Night Tours Launch",
        content: "The Roman Baths in Bath is launching evening torchlit tours for the first time. The atmospheric tours will run on selected weekends and must be pre-booked.",
        location: "Roman Baths, Bath",
        lat: 51.3812,
        lng: -2.3599,
        category: "events",
        source: "Bath Chronicle",
        sourceUrl: "https://www.bathchronicle.co.uk/",
        date: "2026-01-09"
    },
    // OXFORD
    {
        id: 56,
        title: "Bodleian Library Rare Book Discovery",
        content: "Archivists at the Bodleian Library have discovered a previously unknown medieval manuscript during routine conservation work. The 600-year-old document is now being studied by historians.",
        location: "Bodleian Library, Oxford",
        lat: 51.7536,
        lng: -1.2546,
        category: "community",
        source: "Oxford Mail",
        sourceUrl: "https://www.oxfordmail.co.uk/",
        date: "2026-01-11"
    },
    // CAMBRIDGE
    {
        id: 57,
        title: "Cambridge Punting Season Opens Early",
        content: "Unseasonably warm January weather has led to an early start to the punting season on the River Cam. Tour operators report strong bookings from weekend visitors.",
        location: "River Cam, Cambridge",
        lat: 52.2022,
        lng: 0.1149,
        category: "events",
        source: "Cambridge News",
        sourceUrl: "https://www.cambridge-news.co.uk/",
        date: "2026-01-13"
    },
    // BRIGHTON
    {
        id: 58,
        title: "Brighton Pier Restoration Work Begins",
        content: "Essential restoration work has begun on Brighton Palace Pier. The Victorian landmark will remain open during the works, with some rides temporarily closed.",
        location: "Brighton Pier",
        lat: 50.8167,
        lng: -0.1368,
        category: "business",
        source: "The Argus",
        sourceUrl: "https://www.theargus.co.uk/",
        date: "2026-01-07"
    },
    {
        id: 59,
        title: "North Laine Record Store Day Preview",
        content: "Brighton's North Laine independent record shops are gearing up for Record Store Day with exclusive vinyl releases and in-store performances announced.",
        location: "North Laine, Brighton",
        lat: 50.8262,
        lng: -0.1390,
        category: "events",
        source: "Brighton & Hove Independent",
        sourceUrl: "https://www.brightonandhoveindependent.co.uk/",
        date: "2026-01-15"
    },
    // PLYMOUTH
    {
        id: 60,
        title: "Plymouth Hoe New Year's Day Swim",
        content: "Over 300 brave swimmers took part in the traditional New Year's Day swim at Plymouth Hoe. The charity event raised £15,000 for local hospices.",
        location: "Plymouth Hoe",
        lat: 50.3654,
        lng: -4.1427,
        category: "community",
        source: "Plymouth Herald",
        sourceUrl: "https://www.plymouthherald.co.uk/",
        date: "2026-01-02"
    },
    // NORWICH
    {
        id: 61,
        title: "Norwich Castle Keep Reopening",
        content: "Norwich Castle's Norman keep has reopened following a major refurbishment. New galleries tell the story of the castle's 900-year history with interactive displays.",
        location: "Norwich Castle",
        lat: 52.6283,
        lng: 1.2945,
        category: "events",
        source: "Eastern Daily Press",
        sourceUrl: "https://www.edp24.co.uk/",
        date: "2026-01-10"
    },
    // NOTTINGHAM
    {
        id: 62,
        title: "Nottingham Contemporary New Exhibition",
        content: "Nottingham Contemporary has unveiled its major spring exhibition featuring works by Turner Prize-nominated artists. Free entry continues thanks to Arts Council funding.",
        location: "Nottingham Contemporary",
        lat: 52.9490,
        lng: -1.1460,
        category: "events",
        source: "Nottingham Post",
        sourceUrl: "https://www.nottinghampost.com/",
        date: "2026-01-12"
    },
    // SOUTHAMPTON
    {
        id: 63,
        title: "Southampton Cruise Terminal Record Year",
        content: "Southampton cruise terminal handled a record 2.5 million passengers in 2025. New terminal facilities are planned to accommodate even larger ships.",
        location: "Southampton Port",
        lat: 50.8963,
        lng: -1.4048,
        category: "business",
        source: "Daily Echo",
        sourceUrl: "https://www.dailyecho.co.uk/",
        date: "2026-01-08"
    }
];

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

// Normalize postcode for lookup
function normalizePostcode(postcode) {
    return postcode.toUpperCase().replace(/\s+/g, ' ').trim();
}

// Look up postcode coordinates
function lookupPostcode(postcode) {
    const normalized = normalizePostcode(postcode);

    if (postcodeCoordinates[normalized]) {
        return { ...postcodeCoordinates[normalized], postcode: normalized };
    }

    const parts = normalized.split(' ');
    if (parts.length >= 2) {
        const partial = parts[0] + ' ' + parts[1].charAt(0);
        if (postcodeCoordinates[partial]) {
            return { ...postcodeCoordinates[partial], postcode: normalized };
        }
    }

    const outcode = parts[0];
    if (postcodeCoordinates[outcode]) {
        return { ...postcodeCoordinates[outcode], postcode: normalized };
    }

    return null;
}

// Try to get coordinates from postcodes.io API
async function fetchPostcodeCoordinates(postcode) {
    const normalized = normalizePostcode(postcode);

    try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`);
        const data = await response.json();

        if (data.status === 200 && data.result) {
            return {
                lat: data.result.latitude,
                lng: data.result.longitude,
                name: data.result.admin_district || data.result.parish || normalized,
                postcode: normalized
            };
        }
    } catch (error) {
        console.log('API lookup failed, using local lookup');
    }

    return lookupPostcode(postcode);
}

// Weather expanded state
let weatherExpanded = false;

// Toggle weather section
function toggleWeather() {
    const section = document.getElementById('weather-section');
    const content = document.getElementById('weather-content');
    const toggleText = document.getElementById('weather-toggle-text');

    weatherExpanded = !weatherExpanded;

    if (weatherExpanded) {
        section.classList.add('expanded');
        content.style.display = 'block';
        toggleText.textContent = 'Hide details';
    } else {
        section.classList.remove('expanded');
        content.style.display = 'none';
        toggleText.textContent = 'Show details';
    }

    // Save preference
    localStorage.setItem('localnews-weather-expanded', weatherExpanded);
}

// Update weather summary in header
function updateWeatherSummary(weatherCode, temp, description) {
    document.getElementById('weather-summary-icon').textContent = weatherIcons[weatherCode] || '🌡️';
    document.getElementById('weather-summary-temp').textContent = `${Math.round(temp)}°C`;
    document.getElementById('weather-summary-desc').textContent = description;
}

// Fetch weather data from Open-Meteo API
async function fetchWeatherData() {
    const loadingEl = document.getElementById('weather-loading');
    const contentEl = document.getElementById('weather-content');
    const errorEl = document.getElementById('weather-error');

    loadingEl.style.display = 'flex';
    if (weatherExpanded) {
        contentEl.style.display = 'none';
    }
    errorEl.style.display = 'none';

    // Update summary to loading state
    document.getElementById('weather-summary-desc').textContent = 'Loading...';

    try {
        const { lat, lng } = currentLocation;

        // Fetch current weather and forecast
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,pressure_msl,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Europe/London&forecast_days=6`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.reason || 'Weather API error');
        }

        updateWeatherUI(data);
        loadingEl.style.display = 'none';

        // Only show content if expanded
        if (weatherExpanded) {
            contentEl.style.display = 'block';
        }

    } catch (error) {
        console.error('Weather fetch error:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'flex';
        document.getElementById('weather-summary-desc').textContent = 'Unable to load';
    }
}

// Update weather UI with data
function updateWeatherUI(data) {
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const weatherCode = current.weather_code;
    const temp = current.temperature_2m;
    const description = weatherDescriptions[weatherCode] || 'Unknown';

    // Update collapsed summary
    updateWeatherSummary(weatherCode, temp, description);

    // Current weather (expanded view)
    document.getElementById('weather-icon').textContent = weatherIcons[weatherCode] || '🌡️';
    document.getElementById('temp-value').textContent = Math.round(temp);
    document.getElementById('weather-description').textContent = description;
    document.getElementById('weather-location-name').textContent = currentLocation.name || currentLocation.postcode;

    // Weather details
    document.getElementById('feels-like').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('wind-speed').textContent = `${Math.round(current.wind_speed_10m * 0.621371)} mph`;
    document.getElementById('uv-index').textContent = current.uv_index !== undefined ? Math.round(current.uv_index) : '--';
    document.getElementById('cloud-cover').textContent = `${current.cloud_cover}%`;
    document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} hPa`;

    // Sunrise/Sunset
    const sunrise = new Date(daily.sunrise[0]);
    const sunset = new Date(daily.sunset[0]);
    document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunset').textContent = sunset.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // 5-day forecast (skip today, show next 5 days)
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
        const icon = weatherIcons[daily.weather_code[i]] || '🌡️';
        const high = Math.round(daily.temperature_2m_max[i]);
        const low = Math.round(daily.temperature_2m_min[i]);
        const rain = daily.precipitation_probability_max[i];

        forecastContainer.innerHTML += `
            <div class="forecast-item">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temps">
                    <span class="forecast-high">${high}°</span>
                    <span class="forecast-low">${low}°</span>
                </div>
                ${rain > 0 ? `<div class="forecast-rain">${rain}%</div>` : ''}
            </div>
        `;
    }

    // Hourly forecast (next 24 hours)
    const hourlyContainer = document.getElementById('hourly-container');
    hourlyContainer.innerHTML = '';

    const now = new Date();
    const currentHour = now.getHours();

    // Find the starting index for current hour
    let startIdx = 0;
    for (let i = 0; i < hourly.time.length; i++) {
        const hourDate = new Date(hourly.time[i]);
        if (hourDate >= now) {
            startIdx = i;
            break;
        }
    }

    for (let i = startIdx; i < startIdx + 24 && i < hourly.time.length; i++) {
        const time = new Date(hourly.time[i]);
        const hour = time.getHours();
        const timeStr = i === startIdx ? 'Now' : `${hour.toString().padStart(2, '0')}:00`;
        const icon = weatherIcons[hourly.weather_code[i]] || '🌡️';
        const temp = Math.round(hourly.temperature_2m[i]);
        const rain = hourly.precipitation_probability[i];

        hourlyContainer.innerHTML += `
            <div class="hourly-item">
                <div class="hourly-time">${timeStr}</div>
                <div class="hourly-icon">${icon}</div>
                <div class="hourly-temp">${temp}°</div>
                ${rain > 0 ? `<div class="hourly-rain">${rain}%</div>` : ''}
            </div>
        `;
    }
}

// Add distance to each news item and filter by radius
function processNewsData(data) {
    return data
        .map(item => ({
            ...item,
            distance: calculateDistance(currentLocation.lat, currentLocation.lng, item.lat, item.lng)
        }))
        .filter(item => item.distance <= currentRadius)
        .sort((a, b) => a.distance - b.distance);
}

// Format distance for display
function formatDistance(miles) {
    if (miles < 0.1) {
        return "< 0.1 mi";
    } else if (miles < 1) {
        return `${(miles).toFixed(1)} mi`;
    } else {
        return `${miles.toFixed(1)} mi`;
    }
}

// Create HTML for a single news item
function createNewsItemHTML(item) {
    return `
        <article class="news-item" data-category="${item.category}">
            <div class="news-header">
                <h2 class="news-title">${item.title}</h2>
                <span class="news-distance">${formatDistance(item.distance)}</span>
            </div>
            <div class="news-meta">
                <span class="news-location">${item.location}</span>
                <span class="news-category category-${item.category}">${item.category}</span>
            </div>
            <p class="news-content">${item.content}</p>
            <p class="news-source">
                Source: <a href="${item.sourceUrl}" target="_blank" rel="noopener">${item.source}</a>
                &bull; ${formatDate(item.date)}
            </p>
        </article>
    `;
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// Update UI elements with current location
function updateLocationUI() {
    document.getElementById('location-name').textContent = currentLocation.name || currentLocation.postcode;
    document.getElementById('footer-location').textContent = currentLocation.postcode || currentLocation.name;
    document.getElementById('home-postcode-display').textContent = currentLocation.postcode;
    document.getElementById('home-area-display').textContent = currentLocation.name || '';
}

// Render news items
function renderNews() {
    const container = document.getElementById('news-container');
    const processedNews = processNewsData(newsData);

    const filteredNews = currentCategory === 'all'
        ? processedNews
        : processedNews.filter(item => item.category === currentCategory);

    document.getElementById('news-count').textContent = `${filteredNews.length} stories`;

    if (filteredNews.length === 0) {
        container.innerHTML = `<div class="no-news">No news found within ${currentRadius} miles of ${currentLocation.name || currentLocation.postcode}.</div>`;
        return;
    }

    container.innerHTML = filteredNews.map(createNewsItemHTML).join('');
}

// Set postcode status message
function setPostcodeStatus(message, type) {
    const status = document.getElementById('postcode-status');
    status.textContent = message;
    status.className = 'postcode-status ' + type;
}

// Show edit mode for home location
function showHomeEdit() {
    document.getElementById('home-display').style.display = 'none';
    document.getElementById('home-edit').style.display = 'block';
    document.getElementById('postcode-input').value = currentLocation.postcode;
    document.getElementById('postcode-input').focus();
    setPostcodeStatus('', '');
}

// Hide edit mode for home location
function hideHomeEdit() {
    document.getElementById('home-display').style.display = 'flex';
    document.getElementById('home-edit').style.display = 'none';
    setPostcodeStatus('', '');
}

// Handle postcode lookup and save
async function handleSetLocation() {
    const input = document.getElementById('postcode-input');
    const btn = document.getElementById('set-location-btn');
    const postcode = input.value.trim();

    if (!postcode) {
        setPostcodeStatus('Please enter a postcode', 'error');
        return;
    }

    btn.disabled = true;
    setPostcodeStatus('Looking up postcode...', 'loading');

    const result = await fetchPostcodeCoordinates(postcode);
    console.log('Postcode lookup result:', result);

    if (result) {
        currentLocation = {
            lat: result.lat,
            lng: result.lng,
            name: result.name,
            postcode: result.postcode
        };
        console.log('Updated currentLocation:', currentLocation);

        // Save to localStorage
        localStorage.setItem('localnews-location', JSON.stringify(currentLocation));

        updateLocationUI();
        renderNews();
        fetchWeatherData();
        hideHomeEdit();
        setPostcodeStatus('', '');
    } else {
        setPostcodeStatus('Postcode not found. Try a UK postcode.', 'error');
    }

    btn.disabled = false;
}

// Handle geolocation
async function handleUseLocation() {
    const btn = document.getElementById('use-location-btn');

    if (!navigator.geolocation) {
        setPostcodeStatus('Geolocation is not supported by your browser', 'error');
        return;
    }

    btn.disabled = true;
    setPostcodeStatus('Getting your location...', 'loading');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Got geolocation:', latitude, longitude);

            // Reverse geocode to get postcode
            try {
                const response = await fetch(`https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}`);
                const data = await response.json();

                if (data.status === 200 && data.result && data.result.length > 0) {
                    const nearest = data.result[0];
                    currentLocation = {
                        lat: latitude,
                        lng: longitude,
                        name: nearest.admin_district || nearest.parish || 'Your Location',
                        postcode: nearest.postcode
                    };
                    console.log('Set location from geolocation:', currentLocation);

                    localStorage.setItem('localnews-location', JSON.stringify(currentLocation));

                    updateLocationUI();
                    renderNews();
                    fetchWeatherData();
                    hideHomeEdit();
                    setPostcodeStatus('', '');
                } else {
                    // Use coordinates without postcode
                    currentLocation = {
                        lat: latitude,
                        lng: longitude,
                        name: 'Your Location',
                        postcode: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                    };

                    localStorage.setItem('localnews-location', JSON.stringify(currentLocation));

                    updateLocationUI();
                    renderNews();
                    fetchWeatherData();
                    hideHomeEdit();
                    setPostcodeStatus('', '');
                }
            } catch (error) {
                console.error('Reverse geocode failed:', error);
                // Fall back to using coordinates directly
                currentLocation = {
                    lat: latitude,
                    lng: longitude,
                    name: 'Your Location',
                    postcode: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                };

                localStorage.setItem('localnews-location', JSON.stringify(currentLocation));

                updateLocationUI();
                renderNews();
                fetchWeatherData();
                hideHomeEdit();
                setPostcodeStatus('', '');
            }

            btn.disabled = false;
        },
        (error) => {
            console.error('Geolocation error:', error);
            let message = 'Could not get your location';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Location permission denied. Please allow location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'Location unavailable. Please try again.';
                    break;
                case error.TIMEOUT:
                    message = 'Location request timed out. Please try again.';
                    break;
            }
            setPostcodeStatus(message, 'error');
            btn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        }
    );
}

// Handle radius change
function handleRadiusChange(value) {
    currentRadius = parseInt(value);
    document.getElementById('radius-value').textContent = currentRadius;
    localStorage.setItem('localnews-radius', currentRadius);
    renderNews();
}

// Handle refresh
function handleRefresh() {
    const btn = document.getElementById('refresh-btn');
    btn.classList.add('spinning');

    // Update timestamp
    document.getElementById('update-time').textContent = new Date().toLocaleString('en-GB');

    // Re-render news and fetch fresh weather
    renderNews();
    fetchWeatherData();

    // Remove spinning class after animation
    setTimeout(() => {
        btn.classList.remove('spinning');
    }, 600);

    console.log('Refreshed news for location:', currentLocation);
}

// Load saved settings from localStorage
function loadSavedSettings() {
    const savedLocation = localStorage.getItem('localnews-location');
    const savedRadius = localStorage.getItem('localnews-radius');
    const savedWeatherExpanded = localStorage.getItem('localnews-weather-expanded');

    if (savedLocation) {
        try {
            currentLocation = JSON.parse(savedLocation);
        } catch (e) {
            console.log('Could not parse saved location');
        }
    }

    if (savedRadius) {
        currentRadius = parseInt(savedRadius);
        document.getElementById('radius-slider').value = currentRadius;
        document.getElementById('radius-value').textContent = currentRadius;
    }

    // Weather is collapsed by default
    if (savedWeatherExpanded === 'true') {
        weatherExpanded = true;
        document.getElementById('weather-section').classList.add('expanded');
        document.getElementById('weather-toggle-text').textContent = 'Hide details';
    }
}

// Initialize the app
function init() {
    // Load saved settings
    loadSavedSettings();

    // Set update time
    document.getElementById('update-time').textContent = new Date().toLocaleString('en-GB');

    // Update location UI
    updateLocationUI();

    // Initial render
    renderNews();

    // Fetch weather
    fetchWeatherData();

    // Set up event listeners
    document.getElementById('change-home-btn').addEventListener('click', showHomeEdit);
    document.getElementById('cancel-edit-btn').addEventListener('click', hideHomeEdit);
    document.getElementById('set-location-btn').addEventListener('click', handleSetLocation);
    document.getElementById('use-location-btn').addEventListener('click', handleUseLocation);

    document.getElementById('postcode-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSetLocation();
        }
    });

    document.getElementById('radius-slider').addEventListener('input', (e) => {
        handleRadiusChange(e.target.value);
    });

    document.getElementById('category-filter').addEventListener('change', (e) => {
        currentCategory = e.target.value;
        renderNews();
    });

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', handleRefresh);

    // Retry weather button
    document.getElementById('retry-weather-btn').addEventListener('click', fetchWeatherData);

    // Weather toggle
    document.getElementById('weather-header').addEventListener('click', toggleWeather);
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
