const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
  
var dataset;

function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
} 
fs.readFile('Assignment_Dataset.json', (err, data) => {
    if (err) throw err;
    dataset = JSON.parse(data.toString());
    
})

app.get('/data/pakistan', (req, res)=>{
    console.log(req.path)
    res.status(200);
    var pakistan;

    for (let x in dataset) {
        if (dataset[x].country === "Pakistan") {
            pakistan = dataset[x];
            break;
        }
    }
    res.send(pakistan);
    
});

app.get('/data', (req, res)=>{
    console.log(JSON.stringify(req.query["matches-won"]));
    console.log(JSON.stringify(req.query["matches-lost"]));
    console.log(JSON.stringify(req.query["team-matches-played"]));
    console.log(JSON.stringify(req.query["sort"]));
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
    if(sort !== undefined){
        selected.sort(GetSortOrder(sort))
    }
    
    res.status(200);
    res.send(selected);
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);