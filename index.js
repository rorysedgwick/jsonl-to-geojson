const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, 'data/rory.jsonl'), 'utf-8', (err, data) => {
    if(err) {
        console.log('err: ', err);
    }

    console.log('data loaded');

    let geoJSON = {
        type: 'FeatureCollection',
        features: []
    };

    data.split('\n')
        .filter(obj => obj)
        .map(obj => JSON.parse(obj))
        .forEach(record => {
            geoJSON.features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point', 
                    coordinates: [
                        record.location.coords.longitude, record.location.coords.latitude
                    ]
                },
                properties: {
                    ...record
                }
            })
        });

    const outputgeoJSON = JSON.stringify(geoJSON, null, 4);
    // // console.log('output: ', output);
    fs.writeFile(path.resolve(__dirname, 'output.geojson'), outputgeoJSON, err => {
        if(err) {
            console.log('err: ', err);
        }
        console.log('done');
    });
});
