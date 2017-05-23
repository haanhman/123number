var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        centerNode:cc.Node,
        nodeSLNumber:cc.Node,
        learnLevel:cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
        if(this.node.width<1000){
            this.centerNode.scale=0.85;
        }
        this.nodeSLNumber.setLocalZOrder(-10);
        this.nodeSLNumber.active=false;
        var level = Utils.getRangeNumber();
        var imgPath = "";
        if(level == 10) {
            imgPath = "Texture/LearnUI/btn_1to10.png";
            Utils.rangeNumber=10;
        } else {
            imgPath = "Texture/LearnUI/btn_1to5.png";
            Utils.rangeNumber=5;
        }

        Utils.setSpriteFrame(this.learnLevel, imgPath, undefined, true);
    },


    actionNumber123:function(){
        cc.director.loadScene("P_number123.fire");
    },
    actionWordNumber123:function(){

    },
    actionCount123:function(){
        cc.director.loadScene("P_count.fire");
    },
    actionCompare123:function(){
        cc.director.loadScene("P_compare.fire");

    },
    actionReadNumber:function(){

    },
    actionNumberLine:function(){

    },

    actionSlectNumber:function(){
        Utils.soundButton();
        this.nodeSLNumber.active=!this.nodeSLNumber.active;
        this.node.getChildByName("popBG").active=this.nodeSLNumber.active;
    },

    actionSelect15:function(){
        Utils.soundButton();
        this.nodeSLNumber.active=false;
        this.node.getChildByName("popBG").active=false;
        Utils.rangeNumber=5;
        cc.sys.localStorage.setItem("learnLevel", 5);
        Utils.setSpriteFrame(this.learnLevel, "Texture/LearnUI/btn_1to5.png", undefined, true);
    },
    actionSelect110:function(){
        Utils.soundButton();
        this.nodeSLNumber.active=false;
        this.node.getChildByName("popBG").active=false;
        Utils.rangeNumber=10;
        cc.sys.localStorage.setItem("learnLevel", 10);
        Utils.setSpriteFrame(this.learnLevel, "Texture/LearnUI/btn_1to10.png", undefined, true);
    },

    backToHome:function(){
        Utils.soundButton();
        cc.director.loadScene("MainSC.fire");
    },
});
