const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];

if(!inputFile) {
    console.log(`Please supply an input file in the format
        node index.js [inputFilepath]
    `)
    process.exit(1);
};

const outputFile = inputFile.split('/').reverse()[0].replace('.jsonl', '');

fs.readFile(path.resolve(__dirname, `${inputFile}`), 'utf-8', (err, data) => {
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

    fs.writeFile(path.resolve(__dirname, `dist/${outputFile}.geojson`), outputgeoJSON, err => {
        if(err) {
            console.log('err: ', err);
        }
        console.log(`file saved to dist/${outputFile}.geojson`);
    });
});
