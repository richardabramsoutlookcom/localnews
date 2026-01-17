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

// UK areas with coordinates for geocoding
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
    'aberdeen': { lat: 57.1497, lng: -2.0943 },
    'dundee': { lat: 56.4620, lng: -2.9707 },
    'inverness': { lat: 57.4778, lng: -4.2247 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'manchester': { lat: 53.4808, lng: -2.2426 },
    'birmingham': { lat: 52.4862, lng: -1.8904 },
    'liverpool': { lat: 53.4084, lng: -2.9916 },
    'leeds': { lat: 53.8008, lng: -1.5491 },
    'sheffield': { lat: 53.3811, lng: -1.4701 },
    'bristol': { lat: 51.4545, lng: -2.5879 },
    'newcastle': { lat: 54.9783, lng: -1.6178 },
    'nottingham': { lat: 52.9548, lng: -1.1581 },
    'york': { lat: 53.9600, lng: -1.0873 },
    'cambridge': { lat: 52.2053, lng: 0.1218 },
    'oxford': { lat: 51.7520, lng: -1.2577 },
    'brighton': { lat: 50.8225, lng: -0.1372 },
    'bath': { lat: 51.3811, lng: -2.3590 },
    'cardiff': { lat: 51.4816, lng: -3.1791 },
    'swansea': { lat: 51.6214, lng: -3.9436 },
    'belfast': { lat: 54.5973, lng: -5.9301 },
};

// Get coordinates for a location name
function getCoordinates(locationName) {
    const lower = locationName.toLowerCase();
    for (const [name, coords] of Object.entries(ukAreas)) {
        if (lower.includes(name) || name.includes(lower)) {
            return coords;
        }
    }
    return null;
}

// Extract source name from URL
function extractSourceFromUrl(url) {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        const sources = {
            'bbc.co.uk': 'BBC News',
            'bbc.com': 'BBC News',
            'glasgowworld.com': 'Glasgow World',
            'dailyrecord.co.uk': 'Daily Record',
            'edinburghnews.scotsman.com': 'Edinburgh News',
            'scotsman.com': 'The Scotsman',
            'heraldscotland.com': 'The Herald',
            'manchestereveningnews.co.uk': 'Manchester Evening News',
            'birminghammail.co.uk': 'Birmingham Mail',
            'liverpoolecho.co.uk': 'Liverpool Echo',
            'chroniclelive.co.uk': 'Chronicle Live',
            'walesonline.co.uk': 'Wales Online',
            'belfasttelegraph.co.uk': 'Belfast Telegraph',
            'standard.co.uk': 'Evening Standard',
            'theguardian.com': 'The Guardian',
            'independent.co.uk': 'The Independent',
            'mirror.co.uk': 'Daily Mirror',
            'express.co.uk': 'Daily Express',
        };
        return sources[hostname] || hostname;
    } catch {
        return 'News';
    }
}

// Search for news using Bing News RSS
async function searchBingNews(searchTerm) {
    const query = encodeURIComponent(`${searchTerm} news`);

    try {
        const response = await fetch(`https://www.bing.com/news/search?q=${query}&format=rss`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const xml = await response.text();

        // Parse RSS
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

// Get nearby area names based on coordinates
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

// Fetch and store news for a location
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

// Calculate distance using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { lat, lng, radius = 25, location } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'lat and lng required' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseFloat(radius);

    try {
        // Check if we need to fetch fresh news (cache for 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const searchTerm = location || 'UK';

        const recentCount = await sql`
            SELECT COUNT(*) as count FROM news
            WHERE search_term = ${searchTerm.toLowerCase()} AND fetched_at > ${oneHourAgo}
        `;

        // Fetch fresh news if cache is stale or empty
        if (parseInt(recentCount[0].count) < 5) {
            await fetchAndStoreNews(searchTerm, latNum, lngNum);

            // Also fetch for nearby area names
            const nearbyAreas = getNearbyAreaNames(latNum, lngNum);
            for (const area of nearbyAreas.slice(0, 2)) {
                await fetchAndStoreNews(area, latNum, lngNum);
            }
        }

        // Get news from database
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const newsResult = await sql`
            SELECT * FROM news
            WHERE date >= ${thirtyDaysAgo}
            ORDER BY date DESC
            LIMIT 200
        `;

        // Filter by distance in JavaScript
        const news = newsResult
            .map(item => ({
                id: item.id,
                title: item.title,
                content: item.content,
                location: item.location,
                lat: item.lat,
                lng: item.lng,
                category: item.category,
                source: item.source,
                sourceUrl: item.source_url,
                date: item.date,
                distance: calculateDistance(latNum, lngNum, item.lat, item.lng)
            }))
            .filter(item => item.distance <= radiusNum)
            .sort((a, b) => new Date(b.date) - new Date(a.date) || a.distance - b.distance)
            .slice(0, 100);

        res.json({
            success: true,
            count: news.length,
            news
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
    }
}
