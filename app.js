// App state
let currentLocation = {
    lat: 55.7789,
    lng: -4.3194,
    name: 'Newton Mearns',
    postcode: 'G77 5PG'
};
let currentRadius = 10;
let currentCategory = 'all';
let currentSort = 'distance-asc'; // distance-asc, distance-desc, date-asc, date-desc
let newsData = []; // Will be populated from RSS feeds
let isLoadingNews = false;

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

// API base URL - use same origin when served from Node server
const API_BASE = window.location.origin;

// Fetch news from server API
async function fetchAllNews() {
    if (isLoadingNews) return;
    isLoadingNews = true;

    showNewsLoading();

    const locationName = currentLocation.name || currentLocation.postcode;

    console.log('Fetching news for:', locationName);

    try {
        const params = new URLSearchParams({
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            radius: currentRadius,
            location: locationName
        });

        const response = await fetch(`${API_BASE}/api/news?${params}`);
        const data = await response.json();

        if (data.success && data.news) {
            newsData = data.news;
            console.log(`Fetched ${newsData.length} news items from server`);
        } else {
            console.error('Server returned error:', data);
            newsData = [];
        }
    } catch (error) {
        console.error('Error fetching news from server:', error);
        newsData = [];
    }

    isLoadingNews = false;
    hideNewsLoading();
    renderNews();
}

// Force refresh news from server (triggers new web search)
async function refreshNewsFromServer() {
    const locationName = currentLocation.name || currentLocation.postcode;

    try {
        await fetch(`${API_BASE}/api/news/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lat: currentLocation.lat,
                lng: currentLocation.lng,
                location: locationName
            })
        });
    } catch (error) {
        console.error('Error refreshing news:', error);
    }
}

// Get region name from postcode
function getRegionFromPostcode(postcode) {
    if (!postcode) return null;
    const prefix = postcode.split(' ')[0].replace(/[0-9]/g, '');
    const regions = {
        'G': 'Glasgow',
        'EH': 'Edinburgh',
        'AB': 'Aberdeen',
        'DD': 'Dundee',
        'IV': 'Inverness',
        'PA': 'Paisley',
        'KA': 'Kilmarnock',
        'FK': 'Falkirk',
        'ML': 'Motherwell',
        'M': 'Manchester',
        'L': 'Liverpool',
        'B': 'Birmingham',
        'LS': 'Leeds',
        'S': 'Sheffield',
        'NE': 'Newcastle',
        'BS': 'Bristol',
        'CF': 'Cardiff',
        'BT': 'Belfast',
        'SW': 'London',
        'SE': 'London',
        'E': 'London',
        'N': 'London',
        'W': 'London',
        'EC': 'London',
        'WC': 'London',
        'NW': 'London',
    };
    return regions[prefix] || null;
}

// Show loading state for news
function showNewsLoading() {
    const container = document.getElementById('news-container');
    container.innerHTML = `
        <div class="news-loading">
            <div class="news-spinner"></div>
            <span>Fetching local news for ${currentLocation.name || currentLocation.postcode}...</span>
        </div>
    `;
}

// Hide loading state
function hideNewsLoading() {
    // Loading will be replaced by renderNews
}

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
    const processed = data
        .map(item => ({
            ...item,
            distance: calculateDistance(currentLocation.lat, currentLocation.lng, item.lat, item.lng)
        }))
        .filter(item => item.distance <= currentRadius);

    // Sort based on current sort selection
    switch (currentSort) {
        case 'distance-asc':
            processed.sort((a, b) => a.distance - b.distance);
            break;
        case 'distance-desc':
            processed.sort((a, b) => b.distance - a.distance);
            break;
        case 'date-asc':
            processed.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'date-desc':
            processed.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }

    return processed;
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
    const relativeDate = getRelativeDate(item.date);
    return `
        <article class="news-item" data-category="${item.category}">
            <div class="news-header">
                <h2 class="news-title">${item.title}</h2>
                <span class="news-distance">${formatDistance(item.distance)}</span>
            </div>
            <div class="news-meta">
                <span class="news-date-badge" title="${formatDate(item.date)}">${relativeDate}</span>
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

// Get relative date string (e.g., "Today", "Yesterday", "3 days ago")
function getRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateStr);
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

    // If no news data yet, show appropriate message
    if (!newsData || newsData.length === 0) {
        document.getElementById('news-count').textContent = '0 stories';
        container.innerHTML = `<div class="no-news">No news available. Try refreshing or changing your location.</div>`;
        return;
    }

    const processedNews = processNewsData(newsData);

    const filteredNews = currentCategory === 'all'
        ? processedNews
        : processedNews.filter(item => item.category === currentCategory);

    document.getElementById('news-count').textContent = `${filteredNews.length} stories`;

    if (filteredNews.length === 0) {
        container.innerHTML = `<div class="no-news">No news found within ${currentRadius} miles of ${currentLocation.name || currentLocation.postcode}. Try increasing the search radius.</div>`;
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
        fetchAllNews(); // Fetch new news for the new location
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
                    fetchAllNews(); // Fetch news for new location
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
                    fetchAllNews(); // Fetch news for new location
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
                fetchAllNews(); // Fetch news for new location
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

// Handle refresh - triggers fresh web search on server
async function handleRefresh() {
    const btn = document.getElementById('refresh-btn');
    btn.classList.add('spinning');

    // Update timestamp
    document.getElementById('update-time').textContent = new Date().toLocaleString('en-GB');

    // Force server to do fresh web search
    await refreshNewsFromServer();

    // Fetch fresh news and weather
    await fetchAllNews();
    fetchWeatherData();

    // Remove spinning class after animation completes
    setTimeout(() => {
        btn.classList.remove('spinning');
    }, 1000);

    console.log('Refreshed news for location:', currentLocation);
}

// Load saved settings from localStorage
function loadSavedSettings() {
    const savedLocation = localStorage.getItem('localnews-location');
    const savedRadius = localStorage.getItem('localnews-radius');
    const savedWeatherExpanded = localStorage.getItem('localnews-weather-expanded');
    const savedSort = localStorage.getItem('localnews-sort');

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

    if (savedSort) {
        currentSort = savedSort;
        document.getElementById('sort-select').value = currentSort;
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

    // Fetch news (will call renderNews when done)
    fetchAllNews();

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

    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        localStorage.setItem('localnews-sort', currentSort);
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
