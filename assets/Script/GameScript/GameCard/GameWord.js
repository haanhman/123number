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

    addResourcePath:function(str_path){
        var path = Utils.getFilePath("resources/" + str_path);
        var source_exits=false;
        for(var is=0;is<this.arrRS.length;is++){
            if(this.arrRS[is]==path){
                source_exits=true;
                break;
            }
        }
        if(!source_exits){
            this.arrRS[this.index_countRS]=path;
            this.index_countRS++;
        }
    },
    onDisable: function() {// bat buoc phai co de giai phong bo nho
        cc.log("---------onDisable");
        for(var ir=0;ir<this.index_countRS;ir++){
            cc.log("    ---release rs: %s ",this.arrRS[ir]);
            cc.loader.releaseRes(this.arrRS[ir]);
        }

    },

    onLoad: function () {

        this.index_countRS=0;
        this.arrRS=[];

        this.cardData = {};
        this.cardIndex = 0;
        this.blockTouchLeteer = false;
        this.cardName = "";
        this.audioAuration = 0;
        this.ovuongColor = this.ovuong.node.color;
        this.loadJsonData();
    },


    playSoundHelp: function () {
        if (this.blockTouchLeteer) {
            return;
        }
        var mp3File = 'Sound/card/' + this.cardName + '.mp3';
        this.addResourcePath(mp3File);
        Utils.playSoundSource(mp3File, false,true);
    },

    loadJsonData: function () {
        var letter = Utils.play_game_letter;
        if (typeof (letter)=="undefined"){
            letter="a";
            //khong bao gio xay ra truong hop nay, cai nay chi de test thoi
        }

        var jsonUrl = 'cards/' + letter + '.json';
        this.addResourcePath(jsonUrl);
        Utils.loadJson(jsonUrl, function (jsonResponse) {
            this.cardData = jsonResponse;
            //random mang du lieu
            Utils.arrayShuffle(this.cardData["images"]);
            //chi lay 2 card ra de choi thoi
            this.cardData["images"] = this.cardData["images"].slice(0, this.limitCard);
            this.renderUI();
        }.bind(this));
    },

    renderUI: function () {
        cc.log('render lai thong tin card');
        var cardInfo = this.cardData["images"][this.cardIndex];
        this.cardName = cardInfo["card_name"];

        var colorIndex = Math.floor(Math.random() * this.colorRandom.length);
        this.lblTouch.node.color = this.colorRandom[colorIndex];
        this.lblTouch.string = this.cardData["text"];

        var lblTouchWidth = this.lblTouch.node.getContentSize().width;

        if(cardInfo["end_word"] == 0) {
            this.lblTouch.node.setPosition(lblTouchWidth/2, -223);
            this.lblTouch.node.setAnchorPoint(1, 0.5);
            this.ovuong.node.setPosition(0, -22.2);
            this.ovuong.node.setAnchorPoint(1, 0.5);
            this.lblName.node.setPosition(0, -25);
            this.lblName.node.setAnchorPoint(0, 0.5);
        } else {
            this.lblTouch.node.setPosition(-lblTouchWidth/2, -223);
            this.lblTouch.node.setAnchorPoint(0, 0.5);
            this.ovuong.node.setPosition(0, -22.2);
            this.ovuong.node.setAnchorPoint(0, 0.5);
            this.lblName.node.setPosition(0, 0);
            this.lblName.node.setAnchorPoint(1, 0.5);
        }

        if(cardInfo["end_word"] == 0) {
            this.lblName.string = this.cardName.substring(1, this.cardName.length);
        } else {
            this.lblName.string = this.cardName.substring(0, this.cardName.length-1);
        }
        //can ra center
        this.lblName.node.parent.x=50-this.lblName.node.width/2;
        //cc.log("-----lenght : %s",this.lblName.node.width );
        //hien thi anh
        var imageIndex = Math.floor(Math.random() * cardInfo["total_image"]) + 1;
        var imgUrl = 'cards/' + cardInfo['card_name'] + imageIndex + '.png';

        this.addResourcePath(imgUrl);
        Utils.setSpriteFrame(this.picture, imgUrl);

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

        var mp3File = 'Sound/card/' + this.cardData["text"].toLowerCase() + '.mp3';
        this.addResourcePath(mp3File);
        Utils.playSoundSource(mp3File, false,true);
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
            sequence = [];
            sequence.push(cc.delayTime(1.8));
            sequence.push(cc.callFunc(function () {
                this.playCardName();
            }.bind(this)));

            this.node.runAction(cc.sequence(sequence));
        }


    },

    playCardName: function () {
        var mp3File = 'Sound/card/' + this.cardName + '.mp3';
        this.addResourcePath(mp3File);
        Utils.playSoundSource(mp3File, false,true);

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

        var mp3File = 'Sound/gamevoice/kids_say_yay.mp3';
        this.addResourcePath(mp3File);
        Utils.playSoundSource(mp3File, false,true);

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
    },

    exitGame: function () {
        // cc.audioEngine.stopAll();
        // cc.director.loadScene('MainSC');
        // return;
        if (typeof (Utils.arrScene)=="undefined"){
            return;
        }
        if(Utils.arrScene.length<=Utils.index_sc){
            return;
        }
        var nextScName=Utils.arrScene[Utils.index_sc];
        Utils.index_sc++;
        cc.director.loadScene(nextScName);

    },


    touchBackground: function () {
        if (!this.blockTouchLeteer) {

        }
    },

});
