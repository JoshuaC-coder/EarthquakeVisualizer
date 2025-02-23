/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Intial fetch of earthquake data so that default data is displayed
fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=100')
  .then(response => response.json())
  .then(data => {
    processEarthquakeData(data.features);
  })
  .catch(error => console.error('Error fetching data:', error));

// Create the map chart
var chart = root.container.children.push(am5map.MapChart.new(root, {
  panX: "translateX",
  panY: "translateY",
  projection: am5map.geoMercator()
}));

// Create main polygon series for countries (country boundaries)
var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
  geoJSON: am5geodata_worldLow
}));

// Create the city series for earthquakes
var citySeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

// Creates and put container (for the globe/map switch) at 20, 40
var cont = chart.children.push(am5.Container.new(root, {
  layout: root.horizontalLayout,
  x: 20,
  y: 40
}));

// Add "Map" and "Globe" text"
cont.children.push(am5.Label.new(root, {
  centerY: am5.p50,
  text: "Map"
}));

cont.children.push(am5.Label.new(root, {
  centerY: am5.p50,
  text: "Globe"
}));


// Add switch button
var switchButton = cont.children.push(am5.Button.new(root, {
  themeTags: ["switch"],
  centerY: am5.p50,
  icon: am5.Circle.new(root, {
    themeTags: ["icon"]
  })
}));

switchButton.on("active", function () {
  // Display map
  if (!switchButton.get("active")) {
    chart.set("projection", am5map.geoMercator());
    chart.set("panX", "translateX");
    chart.set("panY", "translateY");
  }
  // Display the globe
  else {
    chart.set("projection", am5map.geoOrthographic());
    chart.set("panX", "rotateX");
    chart.set("panY", "rotateY");
  }
});

// Adds grid on the map
var graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
graticuleSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 0.08
});

// Plots points on map
var citySeries = chart.series.push(
  am5map.MapPointSeries.new(root, {})
);

// Styling of the points
citySeries.bullets.push(function () {
  var bullet = am5.Circle.new(root, {
    radius: 10, 
    fill: am5.color(0xff0000), 
    stroke: am5.color(0xffffff), 
    strokeWidth: 2,
    tooltipText: "Magnitude: {title}\nLocation: {location}\nTime: {time}", // Show magnitude, location, and time in tooltip
    fontFamily: "Parkinsans", 

  });

  bullet.adapters.add("radius", function (radius, target) {
    return target.dataItem.dataContext.radius;
  });

  return am5.Bullet.new(root, {
    sprite: bullet,
  });
});

// Make stuff animate on load
chart.appear(1000, 100);








