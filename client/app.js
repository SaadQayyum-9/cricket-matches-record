var HttpRequest = require("xmlhttprequest").XMLHttpRequest;

/**
 * Encode a [deeply] nested object for use in a url
 * Assumes Array.each is defined
*/
function encode(params, prefix = "") {

    var items = [];

    for (var field in params) {
        var key = prefix ? prefix + "[" + field + "]" : field;
        var type = typeof params[field];
        if (type === "object") {
            items.push(encode(params[field], key));
        } else {
            items.push(key + "=" + encodeURIComponent(params[field]));
        }
    }

    return items.join("&");
}
async function getCricketTeam(country) {
    let request = new HttpRequest();
    request.open("GET", "http://localhost:3000/show?country=" + country);
    request.send();
    request.onload = () => {
        console.log(JSON.parse(request.responseText));
        return;
    }
    await new Promise(r => setTimeout(r, 1500));
}
async function getData(matchWon = {}, matchLost = {}, matchPlayed = {}, sortBy = undefined) {
    let queryParams = {
        "matches-won": matchWon,
        "matches-lost": matchLost,
        "team-matches-played": matchPlayed,
        "sort": sortBy
    }
    let request = new HttpRequest();
    request.open("GET", "http://localhost:3000/data?" + encode(queryParams));
    request.send();
    request.onload = () => {
        console.log(JSON.parse(request.responseText));
        return;
    }
    await new Promise(r => setTimeout(r, 1500));
}

async function addCountry(country) {
    let request = new HttpRequest();
    request.open("POST", "http://localhost:3000/add?" + encode(country));
    request.send();
    request.onload = () => {
        console.log(request.responseText);
        return;
    }
    await new Promise(r => setTimeout(r, 1500));
}

async function updateCountry(countryName, updatedCountry) {
    let queryParam = {
        "countryName": countryName,
        "updatedCountry": updatedCountry
    }
    let request = new HttpRequest();
    request.open("PUT", "http://localhost:3000/update?" + encode(queryParam));
    request.send();
    request.onload = () => {
        console.log(request.responseText);
        return;
    }
    await new Promise(r => setTimeout(r, 1500));
}

async function deleteCountry(country) {
    let request = new HttpRequest();
    request.open("DELETE", "http://localhost:3000/delete?country=" + country);
    request.send();
    request.onload = () => {
        console.log(request.responseText);
        return;
    }
    await new Promise(r => setTimeout(r, 1500));
}

// Application
async function runApplication() {
    await getCricketTeam("Pakistan"); // showing Pakistan cricket team
    await addCountry({ // adding a new country "My Country"
        "country": "My Country",
        "team-matches-played": 7,
        "matches-won": 3,
        "matches-lost": 4
    });
    await getCricketTeam("My Country");
    await updateCountry("My Country", {  // update the country given
        "country": "My Country 2"
    });
    await getCricketTeam("My Country 2");
    await deleteCountry("My Country 2"); // delete the country given
    await getCricketTeam("My Country 2");
    let matchWon = {
        gte: 150,
        //lte: 500
    };
    let matchLost = {
        //gte: 50,
        lte: 500
    };
    let matchPlayed = {
        gte: 50,
        lte: 900
    };
    let sort = "country"; // sort alphabetically of countries
    await getData(matchWon, matchLost, matchPlayed, sort); // apply all filters and display data
}

runApplication();