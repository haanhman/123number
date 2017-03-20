/**
 * Created by anhmantk on 3/2/17.
 */
var BridgeInappPurchase = {
    unlockData: function() {
        if(cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("SmIAB", "unlockContent");
        }else if(cc.sys.os == cc.sys.OS_ANDROID) {
            cc.log("Unlock data function");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/SmIAB", "unlockContent", "()V");
        } else {
            cc.log("This device not support inapp purchase");   
        }
    }
}
module.exports = BridgeInappPurchase;