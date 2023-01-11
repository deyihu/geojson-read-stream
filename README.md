# geojson-read-stream

read big geojson file by stream

## Install

```sh
npm i geojson-read-stream
#or
yarn add geojson-read-stream

```

## API

### readGeoJSON(filepath, callback)

```js
const path = require('path');
const {
    readGeoJSON
} = require('geojson-read-stream');

const p = path.join(__dirname, './test/test.geojson');

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
```
