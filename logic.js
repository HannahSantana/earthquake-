var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(earthquakeURL, function (data) {

    createFeatures(data.features);
});


function markerSize(magnitude) {
    return magnitude * 2;
};


function createFeatures(earthquakeData) {

    var earthquakes = L.geoJSON(earthquakeData, {

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: " + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng,
                {
                    radius: markerSize(feature.properties.mag),
                    fillColor: Color(feature.properties.mag),
                    fillOpacity: .7,
                    color: "#000",
                    stroke: true,
                    weight: .7
                });

        }

    })

    createMap(earthquakes);

}


function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'tan'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};


function createMap(earthquakes) {


    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            40, -99
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);



    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
  
}





















