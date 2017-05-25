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
        this.listPos5Number = [[0, 0], [-300, 113], [300, 113], [-300, -169], [300, -169]];
        this.listPos4Number = [[-300, 113], [300, 113], [-300, -169], [300, -169]];
        this.loadGame();
    },

    loadGame: function () {

        var randomNumber = Utils.getRandomInt(1, 2);
        this.listPos3Number = randomNumber == 1 ? [[0, -172], [300, 85], [-300, 85]] : [[0, 85], [300, -172], [-300, -172]];

        this.numbers = [];
        for (var ic = 1; ic <= Utils.getRangeNumber(); ic++) {
            this.numbers.push(ic);
        }

        this.node.getChildByName("bigger").active = false;
        this.node.getChildByName("smaller").active = false;
        for (var ic = 1; ic <= 5; ic++) {
            var nb = this.node.getChildByName("number" + ic);
            if (nb != null) {
                nb.removeFromParent();
            }
        }
        this.ok = false;
        this.logic = "";
        this.gameType = Utils.getRandomInt(1, 4);
        // this.gameType = 4;
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
        return this.listColors[colorIndex - 1];
    },

    initBigger: function () {

        var index = Utils.getRandomInt(0, this.numbers.length - 1);
        var firstNumber = this.numbers[index];
        this.numbers.splice(this.numbers.indexOf(firstNumber), 1);
        index = Utils.getRandomInt(0, this.numbers.length - 1);
        var secondNumber = this.numbers[index];

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
        if (this.ok == true) {
            return;
        }
        this.ok = true;
        this.node.stopAllActions();
        if (this.gameType == 1 || this.gameType == 2) {
            this.node.getChildByName(this.logic).active = true;
        }
        var arr_well = ["awesome", "fantastic", "greatjob", "perfect", "super", "thatsit", "yes", "youraregreat", "youdidit"];
        var rd_index = Utils.getRandomInt(0, arr_well.length - 1);
        var source_path = "Sound/gamevoice/" + arr_well[rd_index] + ".mp3";
        Utils.playSoundSource(source_path, false, true);

        var callFun = cc.callFunc(function () {
            this.loadGame();
        }.bind(this));
        var delayTime = cc.delayTime(1.5);
        this.node.runAction(cc.sequence([delayTime, callFun]));
    },

    chooseNumberFail: function () {
        if (this.ok == true) {
            return;
        }
        this.node.stopAllActions();
        var source_path = "Sound/gamevoice/error.mp3";
        Utils.playSoundSource(source_path, false, true);
    },

    initSmaller: function () {
        var index = Utils.getRandomInt(0, this.numbers.length - 1);
        var firstNumber = this.numbers[index];
        this.numbers.splice(this.numbers.indexOf(firstNumber), 1);
        index = Utils.getRandomInt(0, this.numbers.length - 1);
        var secondNumber = this.numbers[index];

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

    getArrayNumber: function () {
        var listN = [];
        var totalNumber = Utils.getRandomInt(3, Utils.getRangeNumber() == 5 ? 4 : 5);
        for (var ic = 0; ic < totalNumber; ic++) {
            var index = Utils.getRandomInt(0, this.numbers.length - 1);
            listN.push(this.numbers[index]);
            this.numbers.splice(this.numbers.indexOf(this.numbers[index]), 1);
        }
        return listN;
    },

    initBiggest: function () {
        var arrNumber = this.getArrayNumber();
        //tim so lon nhat
        var largest = arrNumber[0];
        for (i = 1; i <= arrNumber.length - 1; i++) {
            if (arrNumber[i] > largest) {
                largest = arrNumber[i];
            }
        }

        var listPos = this.listPos3Number;
        if (arrNumber.length == 4) {
            listPos = this.listPos4Number;
        } else if (arrNumber.length == 5) {
            listPos = this.listPos5Number;
        }

        for (var index = 0; index < arrNumber.length; index++) {
            var number = cc.instantiate(this.compare_number);
            number.name = "number" + parseInt(index + 1);
            console.log(number.name);
            number.getComponent("CompareNumber").setText(arrNumber[index], this.getRandomColor(), arrNumber[index] == largest);
            number.x = listPos[index][0];
            number.y = listPos[index][1];
            this.node.addChild(number);
        }
    },

    initSmallest: function () {
        var arrNumber = this.getArrayNumber();
        //tim so lon nhat
        var small = arrNumber[0];
        for (i = 1; i <= arrNumber.length - 1; i++) {
            if (arrNumber[i] < small) {
                small = arrNumber[i];
            }
        }
        var listPos = this.listPos3Number;
        if (arrNumber.length == 4) {
            listPos = this.listPos4Number;
        } else if (arrNumber.length == 5) {
            listPos = this.listPos5Number;
        }

        for (var index = 0; index < arrNumber.length; index++) {
            var number = cc.instantiate(this.compare_number);
            number.name = "number" + parseInt(index + 1);
            console.log(number.name);
            number.getComponent("CompareNumber").setText(arrNumber[index], this.getRandomColor(), arrNumber[index] == small);
            number.x = listPos[index][0];
            number.y = listPos[index][1];
            this.node.addChild(number);
        }
    },

    actionClose: function () {
        this.node.stopAllActions();
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3", false, true);
        cc.director.loadScene("Practicle.fire");
    }
});
