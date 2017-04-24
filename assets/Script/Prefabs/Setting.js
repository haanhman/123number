var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    actionShare: function () {
        Utils.soundButton();
    },

    actionRateUS: function () {
        Utils.soundButton();
    },

    actionFeedback: function () {
        Utils.soundButton();
    },

    actionMoreApp: function () {
        Utils.soundButton();
    },

    closeBtn: function () {
        Utils.soundButton();
        this.node.removeFromParent(true);
    }
});
