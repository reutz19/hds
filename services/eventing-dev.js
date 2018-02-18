module.exports = {
    url: "https://eventing-dev.api.autodesk.com/hds",
    status_path: "status.overall", //unique path for this service
    getStatus: function () {
        return require('../service_handler.js')(this.url, this.status_path);
    },
    isAvailable: function() {
        return new Promise((resolve, reject) => {
            module.exports.getStatus().then((result) => {
                result["available"] = false;

                resolve(result);
            });
        });
    }
}
