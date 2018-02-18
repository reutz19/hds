module.exports = {
    url: "https://bim360dm-staging.autodesk.com/health?self=true",
    status_path: "status.overall", //unique path for this service
    getStatus: function () {
        return require('../service_handler.js')(this.url, this.status_path);
    },
    isAvailable: function() {
        return new Promise((resolve, reject) => {
            module.exports.getStatus().then((result) => {
                result["available"] = false;
                if (result.status.indexOf("GOOD") != -1) {
                    result["available"] = true;
                };

                resolve(result);
            });
        });
    }
}
