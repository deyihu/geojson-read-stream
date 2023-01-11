const path = require('path');
const { readGeoJSON } = require('./index');

const p = path.join(__dirname, './test/layerdata.geojson');

const time = 'time';
console.time(time);
readGeoJSON(p, (err, geojson) => {
    if (err) {
        console.error(err);
        return;
    }
    console.timeEnd(time);
    console.log(geojson.features.length);
})
