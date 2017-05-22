var Utils = require('Utils');
var GameData = require('GameData');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        nodeSLNumber:cc.Node,
        learnLevel:cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
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

    actionClose:function(){
        Utils.soundButton();
        cc.director.loadScene("MainSC");
    },
    actionSlectNumber:function(){
        Utils.soundButton();
        this.nodeSLNumber.active=!this.nodeSLNumber.active;
        this.node.getChildByName("popBG").active=this.nodeSLNumber.active;
    },
    actionTracing:function(){
        Utils.soundButton();
        GameData.restartGameData();

        var level = Utils.getRangeNumber();
        GameData.arrayScene = [];
        for(var ic = 1; ic <= level; ic++) {
            GameData.arrayScene.push("Trace" + ic)
        }
        var gameScene = GameData.arrayScene[GameData.gameIndex];
        GameData.gameIndex++;
        cc.director.loadScene(gameScene);
    },
    actionLearning:function(){
        Utils.soundButton();
        cc.director.loadScene("Learn123.fire");
    },
    actionCounting:function(){
        cc.director.loadScene("LearnCounting.fire");
        Utils.soundButton();
    },
    actionReading:function(){
        Utils.soundButton();
        cc.director.loadScene("Reading.fire");
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

    actionClickBackground: function () {
        cc.log("Click background");
    }


});
