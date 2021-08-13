var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

var greyscale= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

greyscale.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function(data) {
    
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
          };
    }

    function getColor(depth) {
        switch (true) {
        case depth > 80:
            return "#ea2c2c";
        case depth > 60:
            return "#ea822c";
        case depth > 40:
            return "#ee9c00";
        case depth > 20:
            return "#eecc00";
        case depth > 10:
            return "#d4ee00";
        default:
            return "#98ee00";
        }
    }

    function getRadius(Magnitude) {
        if (Magnitude=== 0) {
            return 1;}
        return Magnitude * 4;
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
    
        style: mapStyle,

        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);}
        }).addTo(map);
    
      var Legend = L.control({
          position: "bottomright"
        });
    
        legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
    
            var grade = [0, 1, 2, 3, 4, 5];
            var color = ["#2c99ea", "#2ceabf", "#92ea2c", "#d5ea2c","#eaa92c", "#ea2c2c"];
    
            for (var i = 0; i<grade.length; i++) {
                div.innerHTML += "<i style='background: " + color[i] + "'></i> " + grade[i] + (grade[i + 1] ? "&ndash;" + grade[i + 1] + "<br>" : "+");
            }
            return div;
        };
    
      legend.addTo(map);
      
    });
