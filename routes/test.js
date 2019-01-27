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
    let url = `http://tm.maniazones.com/?module=leagues&pathid=${id}index.php&p=${page}`;
    
    getData(url)
        .then(result => {
            res.render('leaderboard', { title: title, data: parseData(result.data) });
        })
        .catch(err => 
            res.send(err)
        );
    
});

async function getData(url) {
    return await axios.get(url);
};

function parseData(data) {
    let beginning = data.indexOf(`<table cellspacing="2" class="tableRank">`);
    let end = data.indexOf(`</table>`, beginning);
    let length = end - beginning;

    let substring = data.substr(beginning, length);

    return substring ? substring : data;
}

module.exports = router;
