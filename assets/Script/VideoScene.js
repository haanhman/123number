var vkidsScene = require("VkidsScene");
var Utils = require("Utils");
cc.Class({
    extends: vkidsScene,

    properties: {
        bg: cc.Sprite,
        traceColor: cc.Color,
        songColor: cc.Color
    },

    onLoad: function () {
        this.bg.node.color = Utils.videoType == "song" ? this.songColor : this.traceColor;
    },

    start: function () {
        Utils.playVideoForCard(Utils.videoUrl);
    },
    videoCompleteCallback: function () {
        cc.log("============= Play video complete =============");
        cc.director.loadScene('MainSC');
    },
    closeVideoButton: function () {
        cc.log("============= Close video button =============");
        cc.director.loadScene('MainSC');
    },
});
