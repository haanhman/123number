var vkidsScene = require("VkidsScene");
var Utils = require('Utils');
cc.Class({
    extends: vkidsScene,

    properties: {
        lbl: cc.Label
    },

    onLoad: function () {
        this.touchOk = false;
        this.lbl.node.active = false;
    },

    setLbl: function (number) {
        this.node.stopAllActions();
        var voiceIndex = Utils.getRandomInt(1, 3);
        var sound = "Sound/count_voice" + voiceIndex + "/" + number + ".mp3";
        Utils.playSoundSource(sound, false, true);
        this.lbl.string = number;
        this.lbl.node.active = true;
    }
});
