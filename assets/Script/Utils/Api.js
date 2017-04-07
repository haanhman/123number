/**
 * Created by anhmantk on 4/8/17.
 */
var Api = {
    domain: 'http://54.218.122.252',
    getApi: function (endpoint, callback) {
        var url = this.domain + '/' + endpoint;
        var request = cc.loader.getXMLHttpRequest();
        request.open("GET", url, true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                var httpStatus = request.statusText;
                if(callback != undefined){
                    callback(request.responseText);
                }
            }
        };
        request.send();
    }
}
module.exports = Api;
