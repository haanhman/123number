var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    actionShare: function () {
        Utils.soundButton();
        var parentScript = this.node.parent.getComponent('HomeUIScript');
        parentScript.actionShare();
        this.removePopup();
    },

    actionRateUS: function () {
        Utils.soundButton();
        var parentScript = this.node.parent.getComponent('HomeUIScript');
        parentScript.actionRate();
        this.removePopup();
    },

    actionFeedback: function () {
        Utils.soundButton();
        var parentScript = this.node.parent.getComponent('HomeUIScript');
        parentScript.actionFeedback();
        this.removePopup();
    },

    actionMoreApp: function () {
        Utils.soundButton();
        var parentScript = this.node.parent.getComponent('HomeUIScript');
        parentScript.actionAddMore();
        this.removePopup();
    },

    closeBtn: function () {
        Utils.soundButton();
        var parentScript = this.node.parent.getComponent('HomeUIScript');
        this.removePopup();
    },

    removePopup: function () {
        this.node.removeFromParent(true);
    }

});
