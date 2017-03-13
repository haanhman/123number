/**
 * Created by anhmantk on 3/2/17.
 */
var BridgeDownload = {
    startDownload: function(url) {
        if(cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("BridgeDownload", "startDownload", url);
        }else if(cc.sys.os == cc.sys.OS_ANDROID) {
            cc.log("Unlock data function");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BridgeDownload", "startDownload", "(Ljava/lang/String;)V", url);
        } else {
            cc.log("This device not download");
        }
    }
}
module.exports = BridgeDownload;