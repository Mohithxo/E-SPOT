mapboxgl.accessToken = 
'pk.eyJ1IjoibW9oaXRoMTIiLCJhIjoiY20yd2VnNHF1MDV6azJsc2cwYXg5NWo3MyJ9.CYjk0
 q98LhNWi5B7BY2vTA'; // Replace with your Mapbox access token 
 
// Initialize the map 
const map = new mapboxgl.Map({ 
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: [78.9629, 20.5937], // Center map on India 
    zoom: 5 
}); 
 
// Handle the submit button click 
document.getElementById('submit-btn').addEventListener('click', async function () { 
    const source = document.getElementById('source').value; 
    const destination = document.getElementById('destination').value; 
 
    // Get coordinates from the source and destination 
    const sourceCoords = await getCoordinates(source); 
    const destinationCoords = await getCoordinates(destination); 
 
    // Fetch and display the route 
    const route = await getRoute(sourceCoords, destinationCoords); 
    displayRoute(route); 
     
    // Fetch and display EV charging stations along the route 
    const stations = await getChargingStations(sourceCoords, destinationCoords); 
    displayChargingStations(stations); 
 
    // Scroll to the map section 
    document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' }); 
}); 
 
// Autocomplete functionality for the source and destination input fields 
document.getElementById('source').addEventListener('input', function () { 
    const query = this.value; 
    if (query) { 
        getSuggestions(query, 'source-suggestions'); 
    } else { 
        clearSuggestions('source-suggestions'); 
    } 
}); 
 
document.getElementById('destination').addEventListener('input', function () { 
    const query = this.value; 
    if (query) { 
        getSuggestions(query, 'destination-suggestions'); 
    } else { 
        clearSuggestions('destination-suggestions'); 
    } 
}); 
 
// Fetch suggestions from the Mapbox Geocoding API 
async function getSuggestions(query, suggestionBoxId) { 
    const response = await 
fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponen
 t(query)}.json?access_token=${mapboxgl.accessToken}`); 
    const data = await response.json(); 
    displaySuggestions(data.features, suggestionBoxId); 
} 
 
// Display suggestions in the dropdown 
function displaySuggestions(features, suggestionBoxId) { 
    const suggestionBox = document.getElementById(suggestionBoxId); 
    suggestionBox.innerHTML = ''; // Clear previous suggestions 
    features.forEach(feature => { 
        const item = document.createElement('div'); 
        item.className = 'suggestion-item'; 
        item.innerText = feature.place_name; 
        item.addEventListener('click', function () { 
            document.getElementById(suggestionBoxId === 'source-suggestions' ? 'source' : 
'destination').value = feature.place_name; 
            clearSuggestions(suggestionBoxId); 
        }); 
        suggestionBox.appendChild(item); 
    }); 
    suggestionBox.style.display = features.length ? 'block' : 'none'; 
} 
 
// Clear suggestions when a suggestion is selected or input is cleared 
function clearSuggestions(suggestionBoxId) { 
    document.getElementById(suggestionBoxId).innerHTML = ''; 
    document.getElementById(suggestionBoxId).style.display = 'none'; 
} 
 
// Function to get coordinates from Mapbox Geocoding API 
async function getCoordinates(location) { 
    const response = await 
fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponen
 t(location)}.json?access_token=${mapboxgl.accessToken}`); 
    const data = await response.json(); 
    return data.features[0].geometry.coordinates; // Return [longitude, latitude] 
} 
 
// Function to get the route from Mapbox Directions API 
async function getRoute(startCoords, endCoords) { 
    const response = await 
fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${start
 Coords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${m
 apboxgl.accessToken}`); 
    const data = await response.json(); 
    return data.routes[0].geometry.coordinates; // Return route coordinates 
} 
 
// Function to display the route on the map 
function displayRoute(route) { 
    // Check if route already exists and remove it 
    if (map.getSource('route')) { 
        map.removeLayer('route'); 
        map.removeSource('route'); 
    } 
 
    const routeLine = { 
        type: 'Feature', 
        geometry: { 
            type: 'LineString', 
            coordinates: route.map(coord => [coord[0], coord[1]]) 
        } 
    }; 
 
    map.addSource('route', { 
        type: 'geojson', 
        data: routeLine 
    }); 
 
    map.addLayer({ 
        id: 'route', 
        type: 'line', 
        source: 'route', 
        layout: { 
            'line-join': 'round', 
            'line-cap': 'round' 
        }, 
        paint: { 
            'line-color': '#888', 
            'line-width': 8 
        } 
    }); 
 
    map.fitBounds([[route[0][0], route[0][1]], [route[route.length - 1][0], route[route.length - 1][1]]]); 
} 
 
// Fetch charging stations from the backend API 
async function getChargingStations(sourceCoords, destinationCoords) { 
    try { 
        const response = await fetch(`http://localhost:3000/api/charging
stations?source=${sourceCoords.join(',')}&destination=${destinationCoords.join(',')}`); 
         
        if (!response.ok) { 
            throw new Error(`Failed to fetch charging stations: ${response.statusText}`); 
        } 
 
        const data = await response.json(); 
        return data; 
    } catch (error) { 
        console.error('Error fetching charging stations:', error); 
        return []; 
    } 
} 
 
// Display charging stations on the map 
function displayChargingStations(stations) { 
    const uniqueStations = new Set(); 
    stations.forEach(station => { 
        const coordinates = [station.AddressInfo.Longitude, station.AddressInfo.Latitude]; 
        const uniqueKey = coordinates.toString(); 
 
        if (!uniqueStations.has(uniqueKey)) { 
            uniqueStations.add(uniqueKey); 
            new mapboxgl.Marker() 
                .setLngLat(coordinates) 
                .setPopup(new 
mapboxgl.Popup().setHTML(`<h3>${station.AddressInfo.Title}</h3><p>${station.Addre
 ssInfo.AddressLine1}</p>`)) 
                .addTo(map); 
        } 
    }); 
} 
 
