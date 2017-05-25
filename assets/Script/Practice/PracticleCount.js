var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        title: cc.Label,
        listColors: {
            type: cc.Color,
            default: []
        },
    },

    onLoad: function () {
        this.listImg = ["cat", "drum", "lamp", "monter", "pig", "plane", "rabbit", "tomato", "turtle", "zebra"]
        this.listTitle = ["Count the cats.",
            "How many drums do you see.",
            "Count the lamps.",
            "How many monters do you see.",
            "Count the pigs.",
            "How many planes do you see.",
            "Count the rabbits.",
            "Count the tomatos.",
            "Count the turtles.",
            "How many zebras do you see."]

        this.listNumber = [];
        this.buildListNumber();
        this.loadGame();
        this.playAudioHelp();
    },
    buildListNumber: function () {
        for (var i = 1; i <= Utils.getRangeNumber(); i++) {
            this.listNumber.push(i);
        }
    },
    loadGame: function () {
        if (this.listNumber.length == 0) {
            this.buildListNumber();
        }

        this.imgIndex = Utils.getRandomInt(0, this.listImg.length - 1);
        this.title.string = this.listTitle[this.imgIndex];


        var practicleCount = this.node.getChildByName("practicle_count");
        if (practicleCount != null) {
            practicleCount.removeFromParent();
        }
        var self = this;
        this.ok = false;

        var index = Utils.getRandomInt(0, this.listNumber.length - 1);
        var count = this.listNumber[index];
        this.listNumber.splice(index, 1);

        cc.loader.loadRes("PrefabGame/practicle_count_" + count, function (err, eff_file) {
            if (!(err == null)) {
                cc.log("----error load word  %s ", err);
            }
            var tmp_eff = cc.instantiate(eff_file);
            self.node.addChild(tmp_eff);
            tmp_eff.name = "practicle_count";
            tmp_eff.getComponent('PracticleCountChild').loadImg(self.listImg[self.imgIndex], self.listColors[self.imgIndex]);
        });
    },
    playAudioHelp: function () {
        if (this.ok) {
            return;
        }
        this.node.stopAllActions();
        Utils.playSoundSource("Practicle/Count/Audio/"+ this.listImg[this.imgIndex] +".mp3", false, true);
    },
    actionClose: function () {
        this.node.stopAllActions();
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3", false, true);
        cc.director.loadScene("Practicle.fire");
    },
    countDone: function () {
        this.ok = true;
        var callFun = cc.callFunc(function () {
            this.loadGame();
        }.bind(this));
        var delayTime = cc.delayTime(2.0);
        this.node.runAction(cc.sequence([delayTime, callFun]));
    }
});
