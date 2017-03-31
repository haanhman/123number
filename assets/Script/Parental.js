/**
 * bien action
 * share: Utils.shareAppURL();
 * rate: Utils.rateApp();
 * ourapp: Utils.openOurStore();
 * feedback: Utils.feedBackMail();
 * buy: Utils.unlockData();
 */
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        lblQuestion: cc.Label,
        lblAnswer: cc.Label,
        calculator: cc.Sprite
    },

    onLoad: function () {
        var listNumberString = ["zero","one","two","three","four","five","six","seven","eight","nine"];

        this.lblAnswer.string = "";
        this.randomNumber = [];
        this.chooseNumber = [];
        //neu sai 3 lan thi tat bo luon
        this.fail = 0;
        var randomArray = [];
        for(var i = 0; i<3; i++) {
            var txt = Utils.randomElement(listNumberString);
            this.randomNumber.push(listNumberString.indexOf(txt));
            randomArray.push(txt);
        }

        this.lblQuestion.string = randomArray.join(", ");

    },

    clickNumber: function (event, number) {
        this.chooseNumber.push(parseInt(number));
        this.lblAnswer.string = this.chooseNumber.join("    ");
        if(this.chooseNumber.length == 3) {
            var callFunc=cc.callFunc(function(){
                this.checkParentalResult();
            },this);
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(cc.delayTime(0.5),callFunc));
        }
    },

    checkParentalResult: function () {
        if(this.chooseNumber[0] == this.randomNumber[0] &&
            this.chooseNumber[1] == this.randomNumber[1] &&
            this.chooseNumber[2] == this.randomNumber[2]) {
            this.runAction();
            this.closeBtn();
        } else {
            var animation = this.calculator.node.getComponent("cc.Animation");
            animation.play("parental_fail");
            this.chooseNumber = [];
            this.lblAnswer.string = "";
            this.fail++;
            if(this.fail >= 3) {
                this.closeBtn();
            }
        }
    },

    runAction: function () {
        switch(Utils.parentAction) {
            case 'share':
                Utils.shareAppURL();
                break;
            case 'rate':
                Utils.rateApp();
                break;
            case 'ourapp':
                Utils.openOurStore();
                break;
            case 'feedback':
                Utils.feedBackMail();
                break;
            case 'buy':
                Utils.unlockData();
                break;
        }
    },

    touchBackground: function() {
        cc.log("Please wait...");
    },
    closeBtn: function () {
        this.node.removeFromParent(true);
    }
});
