module.exports = {
    url: "https://360-staging.autodesk.com/health",
    status_path: "HealthCheck.status", //unique path for this service
    getStatus: function () {
        return require('../service_handler.js')(this.url, this.status_path);
    },
    isAvailable: function() {
        return new Promise((resolve, reject) => {
            module.exports.getStatus().then((result) => {
                result["available"] = false;
                if (result.status.indexOf("Good") != -1) {
                    result["available"] = true;
                };

                resolve(result);
            });
        });
    }
}
