const { count } = require('console');
const { response } = require('express');
const express = require('express');
const fs = require('fs');
const { get } = require('http');
const app = express();
const PORT = 3000;

var dataset;

fs.readFile('Assignment_Dataset.json', (err, data) => {
    if (err) throw err;
    dataset = JSON.parse(data.toString());

})
function writeFile(res, msg) {
    fs.writeFile('Assignment_Dataset.json', JSON.stringify(dataset, undefined, 2), err => {
        if (err) {
            res.status(400);
            res.send(err);
            return
        } else {
            res.status(200);
            res.send(msg);
        }
    });
}

app.get('/show', (req, res) => {
    console.log(req.path)
    let country;

    for (let x in dataset) {
        if (dataset[x].country === req.query["country"]) {
            country = dataset[x];
            break;
        }
    } 
    if(country == undefined) {
        res.status(400);
        res.send({"error": "Country not found"});
    } else {
        res.status(200);
        res.send(country);
    }
});

app.post('/add', (req, res) => {
    console.log(req.path)

    if (req.query["country"] != undefined &&
        req.query["team-matches-played"] != undefined &&
        req.query["matches-won"] != undefined &&
        req.query["matches-lost"] != undefined
    ) {
        dataset.push({
            "country": req.query["country"],
            "team-matches-played": parseInt(req.query["team-matches-played"]),
            "matches-won": parseInt(req.query["matches-won"]),
            "matches-lost": parseInt(req.query["matches-lost"])
        });
        writeFile(res, "Successfully Added");
    } else {
        res.status(400);
        res.send("Wrong data received");
    }
});

app.put('/update', (req, res) => {
    console.log(req.path)
    let found = false;
    for (let x in dataset) {
        if (dataset[x].country === req.query["countryName"]) {
            found = true;
            dataset[x] = {
                "country": req.query["updatedCountry"]["country"] ?? dataset[x]["country"],
                "team-matches-played": parseInt(req.query["updatedCountry"]["team-matches-played"] ?? dataset[x]["team-matches-played"]),
                "matches-won": parseInt(req.query["updatedCountry"]["matches-won"] ?? dataset[x]["matches-won"]),
                "matches-lost": parseInt(req.query["updatedCountry"]["matches-lost"] ?? dataset[x]["matches-lost"])
            };
            break;
        }
    }
    if (found) {
        writeFile(res, "Successfully Updated");
    } else {
        res.status(400);
        res.send("Country not found");
    }
});

app.delete('/delete', (req, res) => {
    console.log(req.path)
    res.status(200);
    for (let x in dataset) {
        if (dataset[x].country === req.query["country"]) {
            dataset.splice(x, 1);
        }
    }
    writeFile(res, "Successfully Deleted all values with country name: " + req.query["country"]);
});

function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

app.get('/data', (req, res) => {
    console.log(req.path)
    var sort = req.query["sort"];

    var wonGte = req.query["matches-won"]?.gte ?? 0;
    var wonLte = req.query["matches-won"]?.lte ?? 10000;
    var lostGte = req.query["matches-lost"]?.gte ?? 0;
    var lostLte = req.query["matches-lost"]?.lte ?? 10000;
    var playedGte = req.query["team-matches-played"]?.gte ?? 0;
    var playedLte = req.query["team-matches-played"]?.lte ?? 10000;

    var selected = [];
    for (let x in dataset) {
        if (dataset[x]["matches-won"] >= wonGte &&
            dataset[x]["matches-won"] <= wonLte &&
            dataset[x]["matches-lost"] >= lostGte &&
            dataset[x]["matches-lost"] <= lostLte &&
            dataset[x]["team-matches-played"] >= playedGte &&
            dataset[x]["team-matches-played"] <= playedLte) {
            selected.push(dataset[x]);
        }
    }
    if (sort !== undefined) {
        selected.sort(GetSortOrder(sort))
    }

    res.status(200);
    res.send(selected);
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);