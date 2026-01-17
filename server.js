const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'news.db'));

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        location TEXT,
        lat REAL,
        lng REAL,
        category TEXT,
        source TEXT,
        source_url TEXT,
        date TEXT,
        fetched_at TEXT,
        search_term TEXT,
        UNIQUE(title, source)
    );

    CREATE INDEX IF NOT EXISTS idx_news_location ON news(lat, lng);
    CREATE INDEX IF NOT EXISTS idx_news_date ON news(date);
    CREATE INDEX IF NOT EXISTS idx_news_fetched ON news(fetched_at);
    CREATE INDEX IF NOT EXISTS idx_news_search ON news(search_term);
`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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
    // Scotland
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
    // England
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
    // Wales
    'cardiff': { lat: 51.4816, lng: -3.1791 },
    'swansea': { lat: 51.6214, lng: -3.9436 },
    // Northern Ireland
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

// Search for news using DuckDuckGo (no API key needed)
async function searchNews(searchTerm) {
    const query = encodeURIComponent(`${searchTerm} local news UK site:bbc.co.uk OR site:glasgowworld.com OR site:dailyrecord.co.uk OR site:manchestereveningnews.co.uk OR site:birminghammail.co.uk`);

    try {
        // Use DuckDuckGo HTML search (works without API)
        const response = await fetch(`https://html.duckduckgo.com/html/?q=${query}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const html = await response.text();

        // Parse results from HTML
        const results = [];
        const resultRegex = /<a class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([^<]+)<\/a>/g;

        let match;
        while ((match = resultRegex.exec(html)) !== null && results.length < 10) {
            const url = match[1];
            const title = match[2].trim();
            const snippet = match[3].trim();

            // Skip non-news results
            if (url.includes('duckduckgo.com') || !title) continue;

            results.push({
                title,
                content: snippet,
                sourceUrl: url,
                source: extractSourceFromUrl(url)
            });
        }

        return results;
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

// Alternative: Use Bing News search
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

// Fetch and store news for a location
async function fetchAndStoreNews(searchTerm, lat, lng) {
    console.log(`Fetching news for: ${searchTerm}`);

    // Try Bing News first (more reliable RSS)
    let results = await searchBingNews(searchTerm);

    // Fallback to DuckDuckGo if needed
    if (results.length === 0) {
        results = await searchNews(searchTerm);
    }

    const now = new Date().toISOString();
    const insertStmt = db.prepare(`
        INSERT OR REPLACE INTO news (title, content, location, lat, lng, category, source, source_url, date, fetched_at, search_term)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let inserted = 0;
    for (const result of results) {
        // Get coordinates from location mentions in title/content
        const coords = getCoordinates(result.title + ' ' + result.content) || { lat, lng };

        try {
            insertStmt.run(
                result.title,
                result.content,
                searchTerm,
                coords.lat + (Math.random() - 0.5) * 0.05, // Add small variance
                coords.lng + (Math.random() - 0.5) * 0.05,
                categorizeArticle(result.title + ' ' + result.content),
                result.source,
                result.sourceUrl,
                result.date || now.split('T')[0],
                now,
                searchTerm.toLowerCase()
            );
            inserted++;
        } catch (err) {
            // Duplicate entry, skip
        }
    }

    console.log(`Stored ${inserted} news items for ${searchTerm}`);
    return inserted;
}

// API: Get news for a location
app.get('/api/news', async (req, res) => {
    const { lat, lng, radius = 25, location } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'lat and lng required' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseFloat(radius);

    // Check if we need to fetch fresh news (cache for 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const searchTerm = location || 'UK';

    const recentCount = db.prepare(`
        SELECT COUNT(*) as count FROM news
        WHERE search_term = ? AND fetched_at > ?
    `).get(searchTerm.toLowerCase(), oneHourAgo);

    // Fetch fresh news if cache is stale or empty
    if (recentCount.count < 5) {
        await fetchAndStoreNews(searchTerm, latNum, lngNum);

        // Also fetch for nearby area names
        const nearbyAreas = getNearbyAreaNames(latNum, lngNum);
        for (const area of nearbyAreas.slice(0, 2)) {
            await fetchAndStoreNews(area, latNum, lngNum);
        }
    }

    // Get news from database, calculating distance
    // Haversine formula approximation for small distances
    const news = db.prepare(`
        SELECT *,
            (3959 * acos(
                cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) +
                sin(radians(?)) * sin(radians(lat))
            )) AS distance
        FROM news
        WHERE date >= date('now', '-30 days')
        HAVING distance <= ?
        ORDER BY date DESC, distance ASC
        LIMIT 100
    `).all(latNum, lngNum, latNum, radiusNum);

    res.json({
        success: true,
        count: news.length,
        news: news.map(item => ({
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
            distance: item.distance
        }))
    });
});

// API: Force refresh news for a location
app.post('/api/news/refresh', async (req, res) => {
    const { lat, lng, location } = req.body;

    if (!location) {
        return res.status(400).json({ error: 'location required' });
    }

    const latNum = parseFloat(lat) || 55.8642;
    const lngNum = parseFloat(lng) || -4.2518;

    // Fetch fresh news
    const count = await fetchAndStoreNews(location, latNum, lngNum);

    // Also fetch for region
    const nearbyAreas = getNearbyAreaNames(latNum, lngNum);
    for (const area of nearbyAreas.slice(0, 2)) {
        await fetchAndStoreNews(area, latNum, lngNum);
    }

    res.json({ success: true, fetched: count });
});

// Get nearby area names based on coordinates
function getNearbyAreaNames(lat, lng) {
    const areas = [];
    for (const [name, coords] of Object.entries(ukAreas)) {
        const distance = Math.sqrt(
            Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2)
        );
        if (distance < 0.5) { // Roughly 30 miles
            areas.push({ name, distance });
        }
    }
    return areas.sort((a, b) => a.distance - b.distance).map(a => a.name);
}

// SQLite doesn't have radians function, add it
db.function('radians', (degrees) => degrees * Math.PI / 180);
db.function('acos', Math.acos);
db.function('cos', Math.cos);
db.function('sin', Math.sin);

// Start server
app.listen(PORT, () => {
    console.log(`Local News Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
