let express = require('express');
let axios = require('axios');
let router = express.Router();

let title = "Global Leaderboard";

router.get('/', function(req, res) {
    let id = 1;
    let page = req.query.page !== undefined ? req.query.page : 1;
    if (req.query.id !== undefined) {
        id = req.query.id;
        title = "Regional Leaderboard";
    }
    let url = `http://tm.maniazones.com/index.php?module=leagues&pathid=${id}&p=${page}`;
    
    getData(url)
        .then(result => {
            res.render('leaderboard', { 
                title: stripData(parseData(result.data, `<div class="pathLeft j">`, `</div>`)),
                tableData: parseData(result.data, `<table cellspacing="2" class="tableRank">`, `</table>`) 
            });
        })
        .catch(err => 
            res.send(err)
        );
    
});

async function getData(url) {
    return await axios.get(url);
};

function parseData(data, start, finish) {
    let beginning = data.indexOf(start);
    let end = data.indexOf(finish, beginning);
    let length = end - beginning;

    let substring = data.substr(beginning, length) + finish;

    return substring ? substring : data;
}

function stripData(data) {
    let beginning = data.indexOf(`>`)+1;
    let end = data.indexOf(`<`, beginning);
    let length = end - beginning;

    let substring = data.substr(beginning, length);

    return substring ? substring : data;
}

module.exports = router;
