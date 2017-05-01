var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
    },

    onLoad: function () {

    },

    runAction: function () {
        switch(this.node.action) {
            case 'share':
                Utils.shareAppURL();
                break;
            case 'rate':
                Utils.rateApp();
                this.node.parentScene.reloadAllCard();
                break;
            case 'ourapp':
                Utils.openOurStore();
                break;
            case 'feedback':
                Utils.feedBackMail();
                break;
            case 'buy':
                Utils.unlockData();
                break;
            case 'restore':
                Utils.restoreContent();
                break;
            case 'download':
                this.node.parentScene.downloadNow();
                break;
        }
        this.node.removeFromParent(true);
    },

    touchBackground: function() {
        cc.log("Please wait...");
    },
    closeBtn: function () {
        Utils.soundButton()
        this.node.removeFromParent(true);
    }
});
