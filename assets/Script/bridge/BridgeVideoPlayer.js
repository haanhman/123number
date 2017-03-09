/**
 * Created by anhmantk on 3/2/17.
 */
var BridgeVideoPlayer = {
    playVideo: function (videoPath) {
        cc.log("videoPath: " + videoPath);
        if(cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("BridgeVideoPlayer", "playVideo:", videoPath);
        }else if(cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BridgeVideoPlayer", "playVideo", "(Ljava/lang/String;)V", videoPath);
        } else {
            cc.log("This device not support to play video");   
        }
    },
    unlockData: function() {
        if(cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("BridgeVideoPlayer", "playVideo:", videoPath);
        }else if(cc.sys.os == cc.sys.OS_ANDROID) {
            cc.log("Unlock data function");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/SmIAB", "purchaseRemoveAds", "()V");
        } else {
            cc.log("This device not support inapp purchase");   
        }
    }
}
module.exports = BridgeVideoPlayer;