import { neon } from '@neondatabase/serverless';

// Get database connection
const sql = neon(process.env.DATABASE_URL);

// Category keywords for classification
const categoryKeywords = {
    crime: ['police', 'crime', 'arrest', 'murder', 'theft', 'robbery', 'assault', 'court', 'jail', 'prison', 'stabbing', 'shooting', 'fraud', 'drug', 'criminal'],
    traffic: ['road', 'traffic', 'transport', 'bus', 'train', 'railway', 'motorway', 'accident', 'crash', 'closure', 'diversion', 'roadworks', 'driving', 'a77', 'a8', 'm8', 'm74'],
    community: ['community', 'volunteer', 'charity', 'school', 'church', 'resident', 'neighbourhood', 'park', 'library', 'award', 'fundrais', 'donation'],
    events: ['event', 'festival', 'concert', 'show', 'exhibition', 'opening', 'celebration', 'christmas', 'halloween', 'new year', 'weekend', 'tickets'],
    business: ['business', 'shop', 'store', 'restaurant', 'cafe', 'pub', 'company', 'job', 'employment', 'economy', 'investment', 'development', 'retail'],
    council: ['council', 'government', 'minister', 'mp', 'msp', 'planning', 'tax', 'budget', 'election', 'vote', 'policy', 'councillor']
};

// Categorize article based on keywords
function categorizeArticle(text) {
    const lowerText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                return category;
            }
        }
    }
    return 'community';
}

// UK areas with coordinates
const ukAreas = {
    'glasgow': { lat: 55.8642, lng: -4.2518 },
    'edinburgh': { lat: 55.9533, lng: -3.1883 },
    'milngavie': { lat: 55.9420, lng: -4.3170 },
    'bearsden': { lat: 55.9180, lng: -4.3340 },
    'kirkintilloch': { lat: 55.9393, lng: -4.1530 },
    'bishopbriggs': { lat: 55.9040, lng: -4.2270 },
    'east dunbartonshire': { lat: 55.9400, lng: -4.2000 },
    'newton mearns': { lat: 55.7714, lng: -4.3326 },
    'giffnock': { lat: 55.8052, lng: -4.2946 },
    'clarkston': { lat: 55.7898, lng: -4.2756 },
    'paisley': { lat: 55.8456, lng: -4.4239 },
    'east kilbride': { lat: 55.7649, lng: -4.1769 },
    'hamilton': { lat: 55.7775, lng: -4.0399 },
    'motherwell': { lat: 55.7891, lng: -3.9915 },
    'stirling': { lat: 56.1165, lng: -3.9369 },
};

function getCoordinates(locationName) {
    const lower = locationName.toLowerCase();
    for (const [name, coords] of Object.entries(ukAreas)) {
        if (lower.includes(name) || name.includes(lower)) {
            return coords;
        }
    }
    return null;
}

function extractSourceFromUrl(url) {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        const sources = {
            // National UK
            'bbc.co.uk': 'BBC News',
            'bbc.com': 'BBC News',
            'theguardian.com': 'The Guardian',
            'independent.co.uk': 'The Independent',
            'mirror.co.uk': 'Daily Mirror',
            'express.co.uk': 'Daily Express',
            'dailymail.co.uk': 'Daily Mail',
            'telegraph.co.uk': 'The Telegraph',
            'metro.co.uk': 'Metro',
            'standard.co.uk': 'Evening Standard',
            'itv.com': 'ITV News',
            'sky.com': 'Sky News',
            // Scotland
            'scotsman.com': 'The Scotsman',
            'heraldscotland.com': 'The Herald',
            'dailyrecord.co.uk': 'Daily Record',
            'glasgowlive.co.uk': 'Glasgow Live',
            'glasgowworld.com': 'Glasgow World',
            'edinburghlive.co.uk': 'Edinburgh Live',
            'edinburghnews.scotsman.com': 'Edinburgh News',
            'pressandjournal.co.uk': 'Press and Journal',
            'thecourier.co.uk': 'The Courier',
            'stv.tv': 'STV News',
            'kirkintilloch-herald.co.uk': 'Kirkintilloch Herald',
            'milngavieherald.co.uk': 'Milngavie Herald',
            'dumbartonreporter.co.uk': 'Dumbarton Reporter',
            // England
            'manchestereveningnews.co.uk': 'Manchester Evening News',
            'liverpoolecho.co.uk': 'Liverpool Echo',
            'chroniclelive.co.uk': 'Chronicle Live',
            'yorkshirepost.co.uk': 'Yorkshire Post',
            'birminghammail.co.uk': 'Birmingham Mail',
            'birminghamlive.co.uk': 'Birmingham Live',
            'bristolpost.co.uk': 'Bristol Post',
            'devonlive.com': 'Devon Live',
            'cornwalllive.com': 'Cornwall Live',
            'kentlive.news': 'Kent Live',
            'sussexlive.co.uk': 'Sussex Live',
            'essexlive.news': 'Essex Live',
            'mylondon.news': 'MyLondon',
            // Wales
            'walesonline.co.uk': 'Wales Online',
            'dailypost.co.uk': 'Daily Post',
            // Northern Ireland
            'belfasttelegraph.co.uk': 'Belfast Telegraph',
            'belfastlive.co.uk': 'Belfast Live',
            'irishnews.com': 'Irish News',
        };
        return sources[hostname] || hostname;
    } catch {
        return 'News';
    }
}

async function searchBingNews(searchTerm) {
    const query = encodeURIComponent(`${searchTerm} news`);

    try {
        const response = await fetch(`https://www.bing.com/news/search?q=${query}&format=rss`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const xml = await response.text();
        const results = [];
        const itemRegex = /<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([^\]<]+)(?:\]\]>)?<\/title>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<description>(?:<!\[CDATA\[)?([^\]<]+)(?:\]\]>)?<\/description>[\s\S]*?<pubDate>([^<]+)<\/pubDate>[\s\S]*?<\/item>/g;

        let match;
        while ((match = itemRegex.exec(xml)) !== null && results.length < 15) {
            results.push({
                title: match[1].trim(),
                sourceUrl: match[2].trim(),
                content: match[3].trim().replace(/<[^>]+>/g, ''),
                date: new Date(match[4]).toISOString().split('T')[0],
                source: extractSourceFromUrl(match[2])
            });
        }

        return results;
    } catch (error) {
        console.error('Bing search error:', error);
        return [];
    }
}

function getNearbyAreaNames(lat, lng) {
    const areas = [];
    for (const [name, coords] of Object.entries(ukAreas)) {
        const distance = Math.sqrt(
            Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2)
        );
        if (distance < 0.5) {
            areas.push({ name, distance });
        }
    }
    return areas.sort((a, b) => a.distance - b.distance).map(a => a.name);
}

async function fetchAndStoreNews(searchTerm, lat, lng) {
    console.log(`Fetching news for: ${searchTerm}`);

    const results = await searchBingNews(searchTerm);
    const now = new Date().toISOString();

    let inserted = 0;
    for (const result of results) {
        const coords = getCoordinates(result.title + ' ' + result.content) || { lat, lng };
        const category = categorizeArticle(result.title + ' ' + result.content);

        try {
            await sql`
                INSERT INTO news (title, content, location, lat, lng, category, source, source_url, date, fetched_at, search_term)
                VALUES (
                    ${result.title},
                    ${result.content},
                    ${searchTerm},
                    ${coords.lat + (Math.random() - 0.5) * 0.05},
                    ${coords.lng + (Math.random() - 0.5) * 0.05},
                    ${category},
                    ${result.source},
                    ${result.sourceUrl},
                    ${result.date || now.split('T')[0]},
                    ${now},
                    ${searchTerm.toLowerCase()}
                )
                ON CONFLICT (title, source) DO NOTHING
            `;
            inserted++;
        } catch (err) {
            console.error('Insert error:', err.message);
        }
    }

    console.log(`Stored ${inserted} news items for ${searchTerm}`);
    return inserted;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { lat, lng, location } = req.body;

    if (!location) {
        return res.status(400).json({ error: 'location required' });
    }

    const latNum = parseFloat(lat) || 55.8642;
    const lngNum = parseFloat(lng) || -4.2518;

    try {
        const count = await fetchAndStoreNews(location, latNum, lngNum);

        const nearbyAreas = getNearbyAreaNames(latNum, lngNum);
        for (const area of nearbyAreas.slice(0, 2)) {
            await fetchAndStoreNews(area, latNum, lngNum);
        }

        res.json({ success: true, fetched: count });
    } catch (error) {
        console.error('Refresh error:', error);
        res.status(500).json({ error: 'Failed to refresh news', details: error.message });
    }
}
