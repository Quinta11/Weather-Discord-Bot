const axios = require('axios');
const https = require('https');

// This function converts the user's input for a disturbance to its alternate form, works both ways.
let convertIdentifier = async (identifier) => {
    let result = 'Unknown';
    let basin = identifier.replace(/[^A-Za-z]/g, '');
    let number = identifier.replace(/[A-Za-z]/g, '');
    let length = identifier.length;

    switch (length) {
        case 3:
            if(basin.toLowerCase() == 'l') {
                basin = 'al';
            } else if(basin.toLowerCase() == 'e') {
                basin = 'ep';
            } else if(basin.toLowerCase() == 'w') {
                basin = 'wp';
            }
            result = basin + number;
            break;
        case 4:
            if(basin.toLowerCase() == 'al') {
                basin = 'l';
            } else if(basin.toLowerCase() == 'ep') {
                basin = 'e';
            } else if(basin.toLowerCase() == 'wp') {
                basin = 'w';
            }
            result = number + basin;
            break;
        default:
            break;
    }

    return result
}

// This function reads the two letter abbreviation provided in best track to return the proper classification.
let selectClassification = async (acronym, windspeed) => {
    let classification = 'Unknown';
    
    switch (acronym) {
        case 'DB':
            classification = 'Disturbance';
            break;
        case 'LO':
            classification = 'Low';
            break;
        case 'EX':
            classification = 'Extratropical Cyclone';
            break;
        case 'PT':
            classification = 'Post Tropical Cyclone';
            break;
        case 'TD':
            classification = 'Tropical Depression';
            break;
        case 'SD':
            classification = 'Subtropical Depression';
            break;
        case 'TS':
            classification = 'Tropical Storm';
            break;
        case 'SS':
            classification = 'Subtropical Storm';
            break;
        case 'HU':
            classification = 'Hurricane';
            if(windspeed >= 100) {
                classification = 'Major Hurricane';
            }
            break;
        case 'MD':
            classification = 'Monsoon Depression';
            break;
        case 'TY':
            classification = 'Typhoon';
            break;
        case 'ST':
            classification = 'Super Typhoon';
            break;
        case 'TC':
            classification = 'Cyclone';
            break;
        default:
            break;
    }
    
    return classification
}

// This function reads the max sustained windspeed in best track to return a matching classification thumbnail using the SSHWS system.
let selectThumbnail = async (windspeed) => {
    if(windspeed >= 35) {
        if(windspeed >= 65) {
            if(windspeed >= 85) {
                if(windspeed >= 100) {
                    if(windspeed >= 115) {
                        if(windspeed >= 140) {
                            let thumbnail = 'https://scgeology.github.io/hurricanes/images/c5.png';
                            return thumbnail
                        }
                        let thumbnail = 'https://scgeology.github.io/hurricanes/images/c4.png';
                        return thumbnail
                    }
                    let thumbnail = 'https://scgeology.github.io/hurricanes/images/c3.png';
                    return thumbnail
                }
                let thumbnail = 'https://scgeology.github.io/hurricanes/images/c2.png';
                return thumbnail
            }
            let thumbnail = 'https://scgeology.github.io/hurricanes/images/c1.png';
            return thumbnail
        }
        let thumbnail = 'https://scgeology.github.io/hurricanes/images/ts.png';
        return thumbnail
    } else {
        let thumbnail = 'https://scgeology.github.io/hurricanes/images/tl.png';
        return thumbnail
    }
}

// This function fixes coordinates with improper formatting, most common in best track files where there is no decimal point.
let fixCoords = async (unfixedCoord) => {
    let fixedCoord = await unfixedCoord.slice(0, (unfixedCoord.length - 2)) + "." + unfixedCoord.slice((unfixedCoord.length - 2), (unfixedCoord.length - 1)) + "°" +unfixedCoord.slice(unfixedCoord.length - 1);
    return fixedCoord
}

// This function checks to ensure that the URL being called actually exists; useful for catching errors.
let checkUrlExists = async (url) => {
    try {
        const response = await axios.head(url, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            timeout: 1500, // Adjust the timeout as needed
        });
        return response.status === 200;
    } catch (error) {
        return false; // An error means the URL does not exist or is inaccessible
    }
}

module.exports = {
    convertIdentifier,
    selectClassification,
    selectThumbnail,
    fixCoords,
    checkUrlExists,
}