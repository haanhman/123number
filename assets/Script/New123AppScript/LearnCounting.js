var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        picture: cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
        this.numberIndex = 0;
        if (Utils.getRangeNumber() == 5) {
            this.listNumber = ["1", "2", "3", "4", "5"];
        } else {
            this.listNumber = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        }
        this.loadFingerPicture();
        this.playNumberAudio();
    },


    actionClose: function () {
        this.node.stopAllActions();
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3", false, true);
        cc.director.loadScene("LearnSC.fire");
    },
    actionNext: function () {
        if (this.numberIndex >= (Utils.getRangeNumber() - 1)) {
            return;
        }
        this.numberIndex++;
        this.loadFingerPicture();
        this.playNumberAudio();
    },
    actionBack: function () {
        if (this.numberIndex <= 0) {
            return;
        }
        this.numberIndex--;
        this.loadFingerPicture();
        this.playNumberAudio();
    },

    loadFingerPicture: function () {
        var fImg = "123Fingers/imgfg/" + (this.numberIndex + 1) +"f.jpg";
        Utils.setSpriteFrame(this.picture, fImg);
    },

    actionSound: function () {
        this.playNumberAudio();
    },

    playNumberAudio: function () {
        this.node.getChildByName("nextbt").active = this.numberIndex < (Utils.getRangeNumber() - 1);
        this.node.getChildByName("backbtt").active = this.numberIndex > 0;
        var number = this.listNumber[this.numberIndex];
        var soundms_bg = "Sound/count_voice1/" + number + ".mp3";
        Utils.playSoundSource(soundms_bg, false, true);
    }
});
