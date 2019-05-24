let express = require('express');
let axios = require('axios');
let router = express.Router();

let title = "Global Leaderboard";
let zones = null;

router.get('/', function(req, res) {
    let id = req.query.id !== undefined ? req.query.id : 1;
    let page = req.query.page !== undefined ? req.query.page : 1;

    if (req.query.zone !== undefined && zones !== null) {
        id = searchZone(req.query.zone);
    }

    let url = `http://tm.maniazones.com/index.php?module=leagues&pathid=${id}&p=${page}`;
    
    getData(url)
        .then(result => {
            if (zones === null) {
                zones = findAllZones(result.data);
            }

            let title = parseData(result.data, `<div class="pathLeft j">`, `</div>`);
            let tableData = parseData(result.data, `<table cellspacing="2" class="tableRank">`, `</table>`)
            res.render('leaderboard', { 
                title: title.substr(24, title.length-37),
                tableData: tableData.substr(41, tableData.length-49)
            });
        })
        .catch(err => 
            res.send(err)
        );
    
});

async function getData(url) {
    return await axios.get(url);
};

function parseData(data, start, finish, offset = 0) {
    let beginning = data.indexOf(start, offset);
    let end = data.indexOf(finish, beginning);
    let length = end - beginning;

    let substring = data.substr(beginning, length) + finish;

    return substring ? substring : null;
}

function findAllZones(data) {
    let regex = RegExp(`<a href="\\?module=leagues&amp;pathid=\\d+" title=".+">.+<\\/a>`, `g`);
    let match, matches = [];

    while ((match = regex.exec(data)) !== null) {
        matches.push(match.index);
    }
    
    let result = [];
    matches.forEach(item => {
        let temp = [];
        let title = parseData(data, `title="`, `">`, item);
        let id = parseData(data, `id`, `"`, item);

        temp.push(title.substr(7, title.length - 9));
        temp.push(parseInt(id.substr(3, id.length - 4)));

        result.push(temp);
    });

    return result ? result : null;
}

function searchZone(id) {
    let result = 1;

    zones.forEach(zone => {
        if (isNaN(id)) {
            if (zone[0].replace(/\s/g, "").toUpperCase() === id.replace(/\s/g, "").toUpperCase()) {
                result = zone[1];
            }
        } else {
            if (zone[1] === parseInt(id)) {
                result = zone[1];
            }
        }
    });
    
    return result;
}

module.exports = router;
