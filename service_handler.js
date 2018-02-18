const https = require('https');
const parser = require('./status_parser.js');

//sends request to service "url" and parse response by given "status_path"
module.exports = function(url, status_path) {
    return new Promise((resolve, reject) => {

        https.get(url, res => {
            var body = "";
            var content_type = res.headers['content-type'];
            if (res.statusCode != '200') {
                resolve(onError(url));
            }

            res.on("data",  data => body += data);
            res.on("end",   ()   => {

                //calback function for status result
                var status_callback = function(status) {
                    resolve({
                        url: url,
                        status: status
                    });
                }

                if (content_type.indexOf("json") != -1) {
                        parser.json(body, status_path, status_callback);
                } else if (content_type.indexOf("xml") != -1) {
                        parser.xml(body, status_path, status_callback);
                } else {
                    //undefiend response
                    status_callback("Unavailable");
                }
            });
        }).on("error", e => {
            resolve(onError(url))
        });
    });
};

var onError = function(url) {
    return {
        url: url,
        status: "Unavailable"
    };
};
