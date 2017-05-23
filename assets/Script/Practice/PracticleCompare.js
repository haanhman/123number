var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        listColors: {
            type: cc.Color,
            default: []
        },
        title: cc.Label,
        compare_number: cc.Prefab
    },

    onLoad: function () {
        this.listTitle = ["Which number is bigger", "Which number is smaller", "Which number is biggest", "Which number is smallest"];
        this.listPos1 = [[-180, 0], [180, 0]];
        this.loadGame();
    },

    loadGame: function () {
        this.node.getChildByName("bigger").active = false;
        this.node.getChildByName("smaller").active = false;
        for(var ic = 1; ic <= 5; ic++) {
            var nb = this.node.getChildByName("number" + ic);
            if(nb != null) {
                nb.removeFromParent();
            }
        }
        this.ok = false;
        this.logic = "";
        this.gameType = Utils.getRandomInt(1, 4);
        this.gameType = 2;
        this.title.string = this.listTitle[this.gameType - 1];
        if (this.gameType == 1) {
            this.initBigger();
        } else if (this.gameType == 2) {
            this.initSmaller();
        } else if (this.gameType == 3) {
            this.initBiggest();
        } else {
            this.initSmallest();
        }
        this.playAudioHelp();
    },

    playAudioHelp: function () {
        Utils.playSoundSource("Sound/sentences/whichNumberIs.mp3", false, true);
        var callFun = cc.callFunc(function () {
            cc.log('this.gameType: ' + this.gameType);
            var audio = "smallest";
            if (this.gameType == 1) {
                audio = "bigger";
            } else if (this.gameType == 2) {
                audio = "smaller";
            } else if (this.gameType == 3) {
                audio = "biggest";
            }
            Utils.playSoundSource("Sound/sentences/" + audio + ".mp3", false, true);
        }.bind(this));
        var delayTime = cc.delayTime(1.5);
        this.node.runAction(cc.sequence([delayTime, callFun]));
    },

    getRandomColor: function () {
        var colorIndex = Utils.getRandomInt(1, this.listColors.length);
        return this.listColors[colorIndex-1];
    },

    initBigger: function () {
        var firstNumber = Utils.getRandomInt(1, Utils.getRangeNumber());
        var secondNumber = 0;
        do {
            secondNumber = Utils.getRandomInt(1, Utils.getRangeNumber());
        } while (secondNumber == firstNumber);

        var number1 = cc.instantiate(this.compare_number);
        number1.name = "number1";
        number1.getComponent("CompareNumber").setText(firstNumber, this.getRandomColor(), firstNumber > secondNumber);
        number1.x = this.listPos1[0][0];
        number1.y = this.listPos1[0][1];
        this.node.addChild(number1);

        var number2 = cc.instantiate(this.compare_number);
        number2.name = "number2";
        number2.getComponent("CompareNumber").setText(secondNumber, this.getRandomColor(), firstNumber < secondNumber);
        number2.x = this.listPos1[1][0];
        number2.y = this.listPos1[1][1];
        this.node.addChild(number2);

        this.logic = firstNumber > secondNumber ? "bigger" : "smaller"
    },

    chooseNumberOk: function () {
        if(this.ok == true) {
            return;
        }
        this.ok = true;
        this.node.stopAllActions();
        this.node.getChildByName(this.logic).active = true;
        var arr_well=["awesome","fantastic","greatjob","perfect","super","thatsit","yes","youraregreat","youdidit"];
        var rd_index=Utils.getRandomInt(0,arr_well.length-1);
        var source_path="Sound/gamevoice/"+arr_well[rd_index] + ".mp3";
        Utils.playSoundSource(source_path, false, true);

        var callFun = cc.callFunc(function () {
            this.loadGame();
        }.bind(this));
        var delayTime = cc.delayTime(1.5);
        this.node.runAction(cc.sequence([delayTime, callFun]));
    },

    chooseNumberFail: function () {
        if(this.ok == true) {
            return;
        }
        this.node.stopAllActions();
        var source_path="Sound/gamevoice/error.mp3";
        Utils.playSoundSource(source_path, false, true);
    },

    initSmaller: function () {
        var firstNumber = Utils.getRandomInt(1, Utils.getRangeNumber());
        var secondNumber = 0;
        do {
            secondNumber = Utils.getRandomInt(1, Utils.getRangeNumber());
        } while (secondNumber == firstNumber);

        var number1 = cc.instantiate(this.compare_number);
        number1.name = "number1";
        number1.getComponent("CompareNumber").setText(firstNumber, this.getRandomColor(), firstNumber < secondNumber);
        number1.x = this.listPos1[0][0];
        number1.y = this.listPos1[0][1];
        this.node.addChild(number1);

        var number2 = cc.instantiate(this.compare_number);
        number2.name = "number2";
        number2.getComponent("CompareNumber").setText(secondNumber, this.getRandomColor(), firstNumber > secondNumber);
        number2.x = this.listPos1[1][0];
        number2.y = this.listPos1[1][1];
        this.node.addChild(number2);

        this.logic = firstNumber > secondNumber ? "bigger" : "smaller"
    },

    initBiggest: function () {

    },

    initSmallest: function () {

    },

    actionClose: function () {
        this.node.stopAllActions();
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3", false, true);
        cc.director.loadScene("Practicle.fire");
    }
});
