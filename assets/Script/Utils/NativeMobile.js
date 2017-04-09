var Utils = require('Utils');
var NativeMobile = {

    downloadProgess:function(number_progress){//range 0-1000
        var convert_number=Number(number_progress);
        convert_number=convert_number/1000.0;
        cc.log("download: %s", convert_number);
        if((this.scriptReceiveDownload==null)||(typeof (this.scriptReceiveDownload)=="undefined")){
            //cc.log("NativeMobileJS.scriptGame===null");
        }else{
            this.scriptReceiveDownload.nativedownloadProgess(convert_number);
        }

    },


    errorDownload:function(statusDownload){
        cc.log("errorDownload: " + statusDownload);
        if((this.scriptReceiveDownload==null)||(typeof (this.scriptReceiveDownload)=="undefined")){
            //cc.log("NativeMobileJS.scriptGame===null");
        }else{
            this.scriptReceiveDownload.errorDownload(statusDownload);
        }

    },

    finishDownload:function(statusDownload){
        cc.log("download thanh cong: " + statusDownload);
        if((this.scriptReceiveDownload==null)||(typeof (this.scriptReceiveDownload)=="undefined")){
            //cc.log("NativeMobileJS.scriptGame===null");
        }else{
            this.scriptReceiveDownload.finishDownload(statusDownload);
        }

    },

    unzipFinish:function(){
        cc.log("Unzip file thanh cong");
    },

    setPrice: function (strPrice, type) {
        var mType = parseInt(type + "");
        cc.log('cache price');
        Utils.cachePrice(strPrice, mType == 1 ? "vkids_new_price" : "vkids_old_price");
    }

}

module.exports = NativeMobile;