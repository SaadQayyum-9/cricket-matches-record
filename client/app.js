var HttpRequest = require("xmlhttprequest").XMLHttpRequest;

/**
 * Encode a [deeply] nested object for use in a url
 * Assumes Array.each is defined
*/
function encode(params, prefix = "") {

    var items = [];
    
    for(var field in params) {
        var key  = prefix ? prefix + "[" + field + "]" : field;
        var type = typeof params[field];
        if (type === "object"){
            items.push(encode(params[field], key));
        } else {
            items.push(key + "=" + encodeURIComponent(params[field]));
        }
    }

    return items.join("&");
}
function getPakistanCricketTeam(){
    let request = new HttpRequest();
    request.open("GET", "http://localhost:3000/data/pakistan");
    request.send();
    request.onload = () => {
       console.log(JSON.parse(request.responseText));
    }
}
function getData(matchWon = {}, matchLost = {}, matchPlayed = {}, sortBy = undefined){
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
    }
}
getPakistanCricketTeam();    //uncomment this fucntion to display pakistan cricket team

let matchWon = {
    gte: 150,
    //lte: 500
};
let matchLost = {
  //  gte: 50,
    lte: 500
};
let matchPlayed = {
    gte: 50,
    lte: 900
};
let sort = "country";

getData(matchWon, matchLost, matchPlayed, sort);