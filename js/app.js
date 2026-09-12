// =========================================
// DIANA MAP
// =========================================

// Initialize Davao City map

const map = L.map('map').setView(
    [7.0731, 125.6128],
    13
);


// =========================================
// OPENSTREETMAP BASE MAP
// =========================================

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(map);


console.log('DIANA Map Loaded Successfully!');


// =========================================
// FLOOD PRONE AREAS
// =========================================

let floodLayer;


// Load Flood-Prone Areas CSV

fetch('data/flood_prone_areas.csv')

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Could not load flood_prone_areas.csv'
            );

        }

        return response.text();

    })

    .then(csvText => {

        const lines = csvText
            .trim()
            .split('\n');


        // Create a feature group

        floodLayer = L.featureGroup();


        // Skip the first row because it contains headers

        for (let i = 1; i < lines.length; i++) {

            const values = lines[i]
                .split(',')
                .map(value => value.trim());


            const name = values[0];
            const barangay = values[1];
            const district = values[2];
            const floodType = values[3];
            const riverOrCreek = values[4];
            const latitude = parseFloat(values[5]);
            const longitude = parseFloat(values[6]);


            // Skip locations without coordinates

            if (isNaN(latitude) || isNaN(longitude)) {

                console.warn(
                    'Invalid coordinates:',
                    lines[i]
                );

                continue;

            }


            // Create flood marker

            const marker = L.circleMarker(
                [latitude, longitude],
                {

                    radius: 9,

                    fillColor: '#2196f3',

                    color: '#ffffff',

                    weight: 2,

                    opacity: 1,

                    fillOpacity: 0.8

                }
            );


            // Popup information

            marker.bindPopup(

                '<b>🌊 Flood-Prone Area</b><br><br>' +

                '<b>Location:</b> ' +
                name + '<br>' +

                '<b>Barangay:</b> ' +
                barangay + '<br>' +

                '<b>District:</b> ' +
                district + '<br>' +

                '<b>Flood Type:</b> ' +
                floodType + '<br>' +

                '<b>River/Creek:</b> ' +
                (
                    riverOrCreek
                        ? riverOrCreek
                        : 'Not specified'
                )

            );


            // Add marker to flood layer

            floodLayer.addLayer(marker);

        }


        console.log(
            'Flood-prone areas loaded successfully!'
        );

    })

    .catch(error => {

        console.error(
            'Error loading flood-prone areas:',
            error
        );

    });


// =========================================
// FLOOD ZONES BUTTON
// =========================================

const floodButton =
    document.getElementById('floodButton');


floodButton.addEventListener(
    'click',
    function() {

        if (!floodLayer) {

            alert(
                'Flood data is still loading. Please try again.'
            );

            return;

        }


        // Remove layer if already visible

        if (map.hasLayer(floodLayer)) {

            map.removeLayer(floodLayer);

            floodButton.classList.remove('active');

        }

        else {

            // Add flood layer

            floodLayer.addTo(map);

            floodButton.classList.add('active');


            // Zoom to flood locations

            const bounds =
                floodLayer.getBounds();


            if (bounds.isValid()) {

                map.fitBounds(
                    bounds,
                    {
                        padding: [50, 50]
                    }
                );

            }

        }

    }
);


// =========================================
// FAULT LINES
// =========================================

let faultLayer;


// Load Fault Lines GeoJSON

fetch('data/fault_lines.geojson')

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Could not load fault_lines.geojson'
            );

        }

        return response.json();

    })

    .then(data => {

        faultLayer = L.geoJSON(
            data,
            {

                style: {

                    color: '#f57c00',

                    weight: 4,

                    opacity: 0.9

                },


                onEachFeature:
                function(feature, layer) {

                    const properties =
                        feature.properties || {};


                    layer.bindPopup(

                        '<b>🌎 ' +
                        (
                            properties.name ||
                            'Fault Line'
                        ) +
                        '</b><br><br>' +

                        '<b>Hazard:</b> ' +
                        (
                            properties.hazard ||
                            'Not specified'
                        )

                    );

                }

            }
        );


        console.log(
            'Fault lines loaded successfully!'
        );

    })

    .catch(error => {

        console.error(
            'Error loading fault lines:',
            error
        );

    });


// =========================================
// FAULT LINES BUTTON
// =========================================

const earthquakeButton =
    document.getElementById('earthquakeButton');


earthquakeButton.addEventListener(
    'click',
    function() {

        if (!faultLayer) {

            alert(
                'Fault line data is still loading.'
            );

            return;

        }


        if (map.hasLayer(faultLayer)) {

            map.removeLayer(faultLayer);

            earthquakeButton.classList.remove('active');

        }

        else {

            faultLayer.addTo(map);

            earthquakeButton.classList.add('active');

        }

    }
);


// =========================================
// EVACUATION CENTERS
// =========================================

let evacuationLayer;


// Load Evacuation Centers GeoJSON

fetch('data/evacuation_centers.geojson')

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Could not load evacuation_centers.geojson'
            );

        }

        return response.json();

    })

    .then(data => {

        evacuationLayer = L.geoJSON(
            data,
            {

                pointToLayer:
                function(feature, latlng) {

                    return L.circleMarker(
                        latlng,
                        {

                            radius: 9,

                            fillColor: '#1565c0',

                            color: '#ffffff',

                            weight: 2,

                            fillOpacity: 0.9

                        }
                    );

                },


                onEachFeature:
                function(feature, layer) {

                    const properties =
                        feature.properties || {};


                    layer.bindPopup(

                        '<b>🏫 ' +
                        (
                            properties.name ||
                            'Evacuation Center'
                        ) +
                        '</b><br><br>' +

                        '<b>Type:</b> ' +
                        (
                            properties.type ||
                            'Not specified'
                        )

                    );

                }

            }
        );


        console.log(
            'Evacuation centers loaded successfully!'
        );

    })

    .catch(error => {

        console.error(
            'Error loading evacuation centers:',
            error
        );

    });


// =========================================
// EVACUATION CENTER BUTTON
// =========================================

const evacuationButton =
    document.getElementById('evacuationButton');


evacuationButton.addEventListener(
    'click',
    function() {

        if (!evacuationLayer) {

            alert(
                'Evacuation center data is still loading.'
            );

            return;

        }


        if (map.hasLayer(evacuationLayer)) {

            map.removeLayer(evacuationLayer);

            evacuationButton.classList.remove('active');

        }

        else {

            evacuationLayer.addTo(map);

            evacuationButton.classList.add('active');

        }

    }
);


// =========================================
// SAFE AREAS
// =========================================

let safeAreaLayer;


// Load Safe Areas GeoJSON

fetch('data/safe_areas.geojson')

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Could not load safe_areas.geojson'
            );

        }

        return response.json();

    })

    .then(data => {

        safeAreaLayer = L.geoJSON(
            data,
            {

                style: {

                    color: '#2e7d32',

                    weight: 2,

                    fillColor: '#4caf50',

                    fillOpacity: 0.35

                },


                onEachFeature:
                function(feature, layer) {

                    const properties =
                        feature.properties || {};


                    layer.bindPopup(

                        '<b>🟢 ' +
                        (
                            properties.name ||
                            'Safe Area'
                        ) +
                        '</b><br><br>' +

                        '<b>Classification:</b> ' +
                        (
                            properties.classification ||
                            'Not specified'
                        )

                    );

                }

            }
        );


        console.log(
            'Safe areas loaded successfully!'
        );

    })

    .catch(error => {

        console.error(
            'Error loading safe areas:',
            error
        );

    });


// =========================================
// SAFE AREA BUTTON
// =========================================

const safeAreaButton =
    document.getElementById('safeAreaButton');


safeAreaButton.addEventListener(
    'click',
    function() {

        if (!safeAreaLayer) {

            alert(
                'Safe area data is still loading.'
            );

            return;

        }


        if (map.hasLayer(safeAreaLayer)) {

            map.removeLayer(safeAreaLayer);

            safeAreaButton.classList.remove('active');

        }

        else {

            safeAreaLayer.addTo(map);

            safeAreaButton.classList.add('active');

        }

    }
);


// =========================================
// USER LOCATION
// =========================================

let userLocationMarker = null;


const locationButton =
    document.getElementById('locationButton');


locationButton.addEventListener(
    'click',
    function() {

        if (!navigator.geolocation) {

            alert(
                'Geolocation is not supported by your browser.'
            );

            return;

        }


        locationButton.innerHTML =
            '📍 <span>Finding Location...</span>';


        navigator.geolocation.getCurrentPosition(

            function(position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                const userCoordinates = [
                    latitude,
                    longitude
                ];


                map.setView(
                    userCoordinates,
                    15
                );


                if (userLocationMarker) {

                    map.removeLayer(
                        userLocationMarker
                    );

                }


                userLocationMarker =
                    L.marker(
                        userCoordinates
                    ).addTo(map);


                userLocationMarker.bindPopup(
                    '<b>📍 Your Location</b><br>You are here.'
                ).openPopup();


                locationButton.innerHTML =
                    '📍 <span>My Location</span>';

            },


            function(error) {

                console.error(
                    'Location error:',
                    error
                );


                alert(
                    'Unable to get your location. ' +
                    'Please allow location access.'
                );


                locationButton.innerHTML =
                    '📍 <span>My Location</span>';

            }

        );

    }
);


// =========================================
// ROAD NETWORK
// =========================================

let roadLayer;


// Load Roads GeoJSON

fetch('data/roads.geojson')

    .then(response => {

        if (!response.ok) {

            throw new Error(
                'Could not load roads.geojson'
            );

        }

        return response.json();

    })

    .then(data => {

        roadLayer = L.geoJSON(
            data,
            {

                style: {

                    color: '#555555',

                    weight: 4,

                    opacity: 0.8

                },


                onEachFeature:
                function(feature, layer) {

                    const properties =
                        feature.properties || {};


                    layer.bindPopup(

                        '<b>🛣️ ' +
                        (
                            properties.name ||
                            'Road'
                        ) +
                        '</b>'

                    );

                }

            }
        );


        console.log(
            'Road network loaded successfully!'
        );

    })

    .catch(error => {

        console.error(
            'Error loading roads:',
            error
        );

    });


// =========================================
// ROAD NETWORK BUTTON
// =========================================

const roadButton =
    document.getElementById('roadButton');


roadButton.addEventListener(
    'click',
    function() {

        if (!roadLayer) {

            alert(
                'Road network data is still loading.'
            );

            return;

        }


        if (map.hasLayer(roadLayer)) {

            map.removeLayer(roadLayer);

            roadButton.classList.remove('active');

        }

        else {

            roadLayer.addTo(map);

            roadButton.classList.add('active');

        }

    }
);


// =========================================
// FIND SAFE ROUTE
// =========================================

const routeButton =
    document.getElementById('routeButton');


routeButton.addEventListener(
    'click',
    function() {

        if (!userLocationMarker) {

            alert(
                'Please click My Location first.'
            );

            return;

        }


        if (!safeAreaLayer) {

            alert(
                'Safe area data is still loading.'
            );

            return;

        }


        alert(
            'Safe route calculation will be added next.'
        );

    }
);