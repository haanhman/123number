var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        lblTouch: cc.Label,
        lblName: cc.Label,
        ovuong: cc.Sprite,
        picture: cc.Sprite,
        colorRandom: {
            type: cc.Color,
            default: []
        },
        particleEffect: cc.Prefab,
        limitCard: 0
    },

    onLoad: function () {
        this.cardData = {};
        this.cardIndex = 0;
        this.blockTouchLeteer = false;
        this.cardName = "";
        this.audioAuration = 0;
        this.ovuongColor = this.ovuong.node.color;
        this.lblTouchPostion = this.lblTouch.node.getPosition();
        this.myScheduler = cc.director.getScheduler();
        this.loadJsonData();
    },

    playSoundHelp: function () {
        if (this.blockTouchLeteer) {
            return;
        }
        Utils.playEffect('resources/Sound/card/' + this.cardName + '.mp3', true);
    },

    loadJsonData: function () {
        var letter = cc.sys.localStorage.getItem('play_game_letter');
        var jsonUrl = Utils.getFilePath('resources/cards/' + letter + '.json');
        cc.log("jsonUrl: %s", jsonUrl);
        var self = this;
        cc.loader.load(jsonUrl, function (error, result) {
            if (!(error == null)) {
                cc.log("Load JSON ERROR: %s ", error);
            }
        }, function (error, result) {
            self.cardData = result;
            //random mang du lieu
            Utils.arrayShuffle(self.cardData["images"]);
            //chi lay 2 card ra de choi thoi
            self.cardData["images"] = self.cardData["images"].slice(0, self.limitCard);
            self.renderUI();
        });
    },

    renderUI: function () {
        cc.log('render lai thong tin card');
        var cardInfo = this.cardData["images"][this.cardIndex];
        this.cardName = cardInfo["card_name"];

        var colorIndex = Math.floor(Math.random() * this.colorRandom.length);
        this.lblTouch.node.color = this.colorRandom[colorIndex];
        this.lblTouch.string = this.cardData["text"];


        this.lblName.string = this.cardName.substring(1, this.cardName.length);
        //can ra center
        this.lblName.node.parent.x=50-this.lblName.node.width/2;
        cc.log("-----lenght : %s",this.lblName.node.width );
        //hien thi anh
        var imageIndex = Math.floor(Math.random() * cardInfo["total_image"]) + 1;
        var imgUrl = Utils.getFilePath('resources/cards/' + cardInfo['card_name'] + imageIndex + '.png');
        cc.log("imgUrl: %s", imgUrl);
        this.picture.spriteFrame = new cc.SpriteFrame(imgUrl);
        this.picture.node.runAction(cc.sequence(cc.scaleTo(0.4,1.15),cc.scaleTo(0.4,1.0)));

        this.audioAuration = cardInfo["audio_duration"];
        cc.log('this.audioAuration: ' + this.audioAuration);
        this.playSoundHelp();

    },

    touchLetter: function () {
        if (this.blockTouchLeteer) {
            cc.log("Da touch vao letter roi");
            return;
        }
        this.blockTouchLeteer = true;
        var audioPath = 'resources/Sound/card/' + this.cardData["text"].toLowerCase() + '.mp3';
        Utils.playEffect(audioPath, true);


        {
            var sequence = [];
            sequence.push(cc.delayTime(1.2));
            var pos_move=this.ovuong.node.getPosition();
            if (cc.sys.isBrowser){
                pos_move.y-=12;
            }
            sequence.push(cc.moveTo(0.5, pos_move));
            this.lblTouch.node.runAction(cc.sequence(sequence));

            sequence = [];
            sequence.push(cc.delayTime(1.2));
            sequence.push(cc.tintTo(0.5, 255, 255, 255));
            this.ovuong.node.runAction(cc.sequence(sequence));
        }


        {
            var self = this;
            sequence = [];
            sequence.push(cc.delayTime(1.8));
            sequence.push(cc.callFunc(function () {
                self.playCardName();
            }));

            this.node.runAction(cc.sequence(sequence));
        }


    },

    playCardName: function () {
        Utils.playEffect('resources/Sound/card/' + this.cardName + '.mp3', true);
        var callFunc=cc.callFunc(this.playKidsSayYay,this);
        this.ovuong.node.runAction(cc.sequence(cc.scaleTo(0.4,1.3),cc.scaleTo(0.4,1.0)));
        this.lblTouch.node.runAction(cc.sequence(cc.scaleTo(0.4,1.3),cc.scaleTo(0.4,1.0)));
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(this.audioAuration + 0.1),callFunc));
    },


    playKidsSayYay: function () {
        var effect = cc.instantiate(this.particleEffect);
        effect.name = "success_effect";
        effect.x = 0;
        this.node.addChild(effect);
        Utils.playEffect('resources/Sound/gamevoice/kids_say_yay.mp3');

        var callFunc=cc.callFunc(this.nextCard,this);
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(5.0),callFunc));
    },

    nextCard: function () {
        this.node.getChildByName("success_effect").removeFromParent(true);
        cc.log("this.cardIndex: %s, %s", this.cardIndex, this.limitCard);
        if (this.cardIndex >= (this.limitCard - 1)) {
            this.exitGame();
            return;
        }
        this.blockTouchLeteer = false;
        this.cardIndex++;
        this.renderUI();
        this.ovuong.node.color = this.ovuongColor;
        this.lblTouch.node.setPosition(this.lblTouchPostion);
    },

    exitGame: function () {
        cc.audioEngine.stopAll();
        cc.director.loadScene('MainSC');
    },

    touchBackground: function () {
        if (!this.blockTouchLeteer) {
            Utils.playEffect('resources/Sound/gamevoice/error.mp3', true);
        }
    },

});
