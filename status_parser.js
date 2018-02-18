const objectPath = require("object-path");
const xml2js = require('xml2js');

module.exports = {
    json: function(body, status_path, callback) {
        var json_body = JSON.parse(body);
        var status = objectPath.get(json_body, status_path);

        if (!status) {
            callback("Unavilable");
        } else {
            callback(status);
        }
    },
    xml: function(body, status_path, callback) {
        var parser = new xml2js.Parser();
        parser.parseString(body, function (err, json_body) {
            module.exports.json(JSON.stringify(json_body), status_path, callback);
        });
    }
}
