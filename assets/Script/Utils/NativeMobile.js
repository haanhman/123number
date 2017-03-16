var NativeMobile = {

    downloadProgess:function(number_progress){//range 0-1000
        var convert_number=Number(number_progress);
        convert_number=convert_number/1000.0;

        if((this.scriptReceiveDownload==null)||(typeof (this.scriptReceiveDownload)=="undefined")){
            //cc.log("NativeMobileJS.scriptGame===null");
        }else{
            this.scriptReceiveDownload.nativedownloadProgess(convert_number);
        }

    },


    errorDownload:function(statusDownload){

        if((this.scriptReceiveDownload==null)||(typeof (this.scriptReceiveDownload)=="undefined")){
            //cc.log("NativeMobileJS.scriptGame===null");
        }else{
            this.scriptReceiveDownload.errorDownload(statusDownload);
        }

    },

    finishDownload:function(statusDownload){

        if((this.scriptReceiveDownload==null)||(typeof (this.scriptReceiveDownload)=="undefined")){
            //cc.log("NativeMobileJS.scriptGame===null");
        }else{
            this.scriptReceiveDownload.finishDownload(statusDownload);
        }

    },
}

module.exports = NativeMobile;