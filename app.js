// BASE SETUP
// ==============================================
var express = require('express');
var app  = express();

const port  = 8080;
const services_list = [
    require('./services/bim360dm-dev.js'),
    require('./services/bim360dm-staging.js'),
    require('./services/commands-bim360dm-dev.js'),
    require('./services/eventing-dev.js'),
    require('./services/360-staging.js')
];

// service availability structure
var status_samples = {};
services_list.forEach((service) => {
    status_samples[service.url] = [];
});

var sec_interval = 60;
var max_samples_num = 60;

// ROUTES
// ===============================================

app.get('/statuses', (req, res) => {
    console.log('statuses request');

    all_promises = []
    services_list.forEach((service) => {
        // get status per service
        all_promises.push(service.getStatus());
    })

    Promise.all(all_promises).then((statuses) => {
        //return response when all statuses returned

        if (statuses && statuses.length > 0) {
            res.send(statuses);
        }
        else {
            res.status(500).send({ error: 'No available services' });
        }
    });
});

app.get('/availability', (req, res) => {
    console.log('availability request');

    availabilities = [];
    for (var service_url in status_samples) {
        if (status_samples.hasOwnProperty(service_url)) {

            var count = 0;          //all requests counter
            var true_count = 0;     //available requests counter

            for (var i in status_samples[service_url]) {
                count += 1;
                if (status_samples[service_url][i]) {
                    true_count += 1;
                }
            }
            //console.log("count: " + count + " true_count: " + true_count);
            var percentage = (count == 0) ? 0 : true_count / count * 100.0;
            availabilities.push({
                url: service_url,
                available_percentage: percentage
            });
        }
    }

    if (availabilities && availabilities.length > 0) {
        res.send(availabilities);
    }
    else {
        res.status(500).send({ error: 'No available services' });
    }
});

// update service statuse
setInterval(function() {
    services_list.forEach((service) => {
        service.isAvailable().then((service) => {
            if (service.hasOwnProperty('url') && service.hasOwnProperty('available')) {
                //add a new sample to service sample list
                status_samples[service.url].push(service.available);
                if (status_samples[service.url].length > max_samples_num) {
                    status_samples[service.url].shift();
                }
            }
        })
    });
}, sec_interval * 1000);

app.listen(port, () => console.log('Server listening on port ' + port + '!'));
