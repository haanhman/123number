/**
 * Created by anhmantk on 4/8/17.
 */
var Api = {
    domain: 'http://54.218.122.252',
    dropbox: 1,
    github: 2,
    firebase: 3,

    addDefaultParam: function (endpoint) {
        var os = cc.sys.os == cc.sys.OS_IOS ? "ios" : "android";
        return endpoint + "?platform=" + os;
    },

    getApi: function (endpoint, callback) {
        var url = this.addDefaultParam(this.domain + '/' + endpoint);
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
    },

    postApi: function (endpoint, option ,callback) {
        var url = this.addDefaultParam(this.domain + '/' + endpoint);
        var request = cc.loader.getXMLHttpRequest();
        var list = [];
        for(var key in option) {
            list.push(key + "=" +option[key]);
        }
        var params = list.join("&");
        request.open("POST", url, true);
        request.send(params);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                var httpStatus = request.statusText;
                if(callback != undefined){
                    callback(request.responseText);
                }
            }
        };
    }
}
module.exports = Api;
