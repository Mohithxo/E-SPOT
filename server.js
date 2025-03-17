// server.js 
import express from 'express'; 
import fetch from 'node-fetch'; 
const app = express(); 
const PORT = 3000; 
// Replace with your Mapbox and Open Charge Map API keys 
const MAPBOX_ACCESS_TOKEN = 
'pk.eyJ1IjoibW9oaXRoMTIiLCJhIjoiY20yd2VnNHF1MDV6azJsc2cwYXg5NWo3MyJ9.CYjk0
 q98LhNWi5B7BY2vTA'; 
const OPEN_CHARGE_MAP_API_KEY = 'b3A051b-042c-4646-8158-685d91c60f6e';  
// Allow CORS (for development purposes only) 
app.use((req, res, next) => { 
res.header("Access-Control-Allow-Origin", "*"); 
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content
Type, Accept"); 
next(); 
}); 
// Route to fetch EV charging stations along a route 
app.get('/api/charging-stations', async (req, res) => { 
    const { source, destination } = req.query; 
 
    try { 
        // Step 1: Get route from source to destination 
        const routeResponse = await 
fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${source};${destination}?
 geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`); 
        const routeData = await routeResponse.json(); 
 
        // Check if the routeData has valid routes 
        if (!routeData.routes || routeData.routes.length === 0) { 
            return res.status(404).json({ error: "Route not found" }); 
        } 
 
        const routeCoordinates = routeData.routes[0].geometry.coordinates; 
 
        // Step 2: Find EV charging stations along the route 
        const stations = []; 
 
        for (const coord of routeCoordinates) { 
            const [longitude, latitude] = coord; 
            const stationsResponse = await 
fetch(`https://api.openchargemap.io/v3/poi/?latitude=${latitude}&longitude=${longitud
 e}&distance=5&maxresults=5&compact=true&verbose=false`, { 
                headers: { 
                    'X-API-Key': OPEN_CHARGE_MAP_API_KEY // Include the API key in the header 
                } 
            }); 
            const stationData = await stationsResponse.json(); 
            stations.push(...stationData); // Collect stations along the route 
        } 
 
        // Step 3: Return the collected charging stations 
        res.json(stations); 
    } catch (error) { 
        console.error("Error fetching charging stations:", error); 
        res.status(500).json({ error: "Error fetching charging stations" }); 
    } 
}); 
 
app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`); 
});
