

var Utils = {

    playVideoForCard:function(cardname){
        cc.log("lkahdsahdhkashdjashdjsahjkd: "+cardname);
        if(cc.sys.os==cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("BridgeIOS", "playVideoName:",cardname);
        }else if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BridgeAndroid", "playVideoName", "(Ljava/lang/String;)V",cardname);
        }
    },



    beginDownloadFile:function(strfileDownload){
        if(cc.sys.os==cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("BridgeJS2IOS", "beginDownloadData:",strfileDownload);
        }else if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BridgeAndroid", "beginDownloadFile", "(Ljava/lang/String;)V",strfileDownload);
        }
    }





}
module.exports = Utils;





















