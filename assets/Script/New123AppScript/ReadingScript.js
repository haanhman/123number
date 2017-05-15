var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        lbNumber:cc.Label,

    },

    // use this for initialization
    onLoad: function () {
        this.numberIndex = 0;
        if(Utils.getRangeNumber() == 5) {
            this.listNumber = ["One", "Two", "Three", "Four", "Five"];
        } else {
            this.listNumber = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
        }
        this.lbNumber.string = this.listNumber[this.numberIndex];
        this.playNumberAudio();
    },


    actionClose:function(){
        this.node.stopAllActions();
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3",false,true);
        cc.director.loadScene("LearnSC.fire");
    },
    actionNext:function(){
        if(this.numberIndex >= (Utils.getRangeNumber() - 1)) {
            return;
        }
        this.numberIndex++;
        this.lbNumber.string = this.listNumber[this.numberIndex];
        this.playNumberAudio();
    },
    actionBack:function(){
        if(this.numberIndex <= 0) {
            return;
        }
        this.numberIndex--;
        this.lbNumber.string = this.listNumber[this.numberIndex];
        this.playNumberAudio();
    },
    actionSound:function(){
        this.playNumberAudio();
    },

    playNumberAudio: function () {
        this.node.getChildByName("nextbt").active = this.numberIndex < (Utils.getRangeNumber() - 1);
        this.node.getChildByName("backbtt").active = this.numberIndex > 0;
        var number = this.numberIndex+1;
        var soundms_bg="Sound/count_voice1/"+number+".mp3";
        Utils.playSoundSource(soundms_bg,false,true);
    }
});
