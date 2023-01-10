const fs = require('fs');

function replaceEnter(str) {
    while (str.indexOf('\n') > -1) {
        str = str.replace('\n', '');
    }
    return str;
}

const TEMPCOUNT = [];
function calObjectCount(str) {
    TEMPCOUNT[0] = 0;
    TEMPCOUNT[1] = 0;
    let starCount = 0, endCount = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        const s = str[i];
        if (s === '{') {
            starCount++;
        } else if (s === '}') {
            endCount++;
        }
    }
    TEMPCOUNT[0] = starCount;
    TEMPCOUNT[1] = endCount;
}

function readGeoJSON(filePath, callback) {
    if (!callback) {
        console.error('callback is undefined');
        return;
    }
    if (!filePath && callback) {
        callback(`filePath is undefined`);
        return;
    }
    if (!fs.existsSync(filePath)) {
        callback(`the file of ${filePath} is not exist`);
        return;
    }
    const features = [];
    let tempStr = '';
    let featuresJudge = false;
    const stream = fs.createReadStream(filePath);
    stream.on('data', function (chunk) {  //chunk是buffer类型
        let str = chunk.toString();
        str = replaceEnter(str);
        tempStr += str;
        if (!featuresJudge) {
            const index = tempStr.indexOf('"features":');
            if (index > -1) {
                tempStr = str.substring(index, Infinity);
                tempStr = tempStr.replace('"features":', '');
                tempStr = tempStr.replace('[', '');
                featuresJudge = true;
            }
        }
        if (!featuresJudge) {
            return;
        }
        let startIndex = undefined, endIndex = undefined;
        while (1) {
            if (startIndex === undefined) {
                startIndex = tempStr.indexOf('{');
                endIndex = tempStr.indexOf('}');
            }
            if (startIndex === -1 || endIndex === -1) {
                break;
            }
            const str = tempStr.substring(startIndex, endIndex + 1);
            calObjectCount(str);
            if (!(TEMPCOUNT[0] > 0 && TEMPCOUNT[0] === TEMPCOUNT[1])) {
                endIndex = tempStr.indexOf('}', endIndex + 1);
                continue;
            }
            try {
                const json = JSON.parse(str);
                if (json.geometry) {
                    tempStr = tempStr.substring(endIndex + 1, Infinity);
                    startIndex = undefined;
                    endIndex = undefined;
                    features.push(json);
                } else {
                    endIndex = tempStr.indexOf('}', endIndex + 1);
                }
            } catch (error) {
                endIndex = tempStr.indexOf('}', endIndex + 1);
            }
        }

    })
    stream.on('end', function (chunk) {
        stream.destroy();
        callback(null, {
            type: 'FeatureCollection',
            features
        });
    })
}

module.exports = {
    readGeoJSON
}
