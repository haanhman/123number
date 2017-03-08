

var Utils = {

    playVideoForCard:function(cardname){
        cc.log("lkahdsahdhkashdjashdjsahjkd: "+cardname);
        if(cc.sys.os==cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("BridgeIOS", "playVideoName:",cardname);
        }else if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BridgeAndroid", "playVideoName", "(Ljava/lang/String;)V",cardname);
        }
    },




}
module.exports = Utils;





















