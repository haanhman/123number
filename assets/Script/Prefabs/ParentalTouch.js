var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {},

    onLoad: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {
                var touchOk = true;
                if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_ANDROID) {
                    touchOk = event.getTouches().length >= 2;
                }
                if (touchOk) {
                    var parentScript = self.node.parent.getComponent('Parental');
                    parentScript.runAction();
                }
            }
        }, self.node);
    },
});
