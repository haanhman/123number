var Utils = require('Utils');
var GameData = require('GameData');
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
        btnSound: cc.Sprite
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

        this.isClosed=false;

        this.index_countRS=0;
        this.arrRS=[];

        this.blockTouchLeteer = false;
        this.cardName = "";
        this.audioAuration = 0;
        this.ovuongColor = this.ovuong.node.color;
        this.renderUI();
    },


    playSoundHelp: function () {
        if (this.blockTouchLeteer) {
            return;
        }
        var mp3File = 'Sound/card/' + this.cardName + '.mp3';
        this.addResourcePath(mp3File);
        Utils.playSoundSource(mp3File, false,true);
    },

    renderUI: function () {
        this.btnSound.node.active = true;
        var allchild=this.node.children;
        for(var iac in allchild){
            var tmp_node=allchild[iac];
            if(tmp_node.name=="bg"||tmp_node.name=="closeButton"){
                continue;
            }
            if(tmp_node.name=="picture"){
                var bx=tmp_node.x;
                var scsize=this.node.width/1.5;
                tmp_node.x=tmp_node.x+scsize;
                tmp_node.runAction(cc.moveTo(0.4,cc.p(bx,tmp_node.y)));
            }
        }
        this.ovuong.node.opacity=0;
        this.ovuong.node.runAction(cc.sequence(cc.delayTime(0.4),cc.fadeTo(0.4,255)));



        cc.log('render lai thong tin card');
        var cardInfo = GameData.gameCard.cardData["images"][GameData.gameCard.cardIndex];
        this.cardName = cardInfo["card_name"];

        var colorIndex = Math.floor(Math.random() * this.colorRandom.length);
        this.lblTouch.node.color = this.colorRandom[colorIndex];
        this.lblTouch.string = GameData.gameCard.cardData["text"];

        var lblTouchWidth = this.lblTouch.node.getContentSize().width;

        if(cardInfo["end_word"] == 0) {
            this.lblTouch.node.setPosition(lblTouchWidth/2, -223);
            this.lblTouch.node.setAnchorPoint(1, 0.5);
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
        Utils.setSpriteFrame(this.picture, imgUrl, function () {
            //scale anh
            var imgScale = 250 / this.picture.node.getContentSize().height;
            if(imgScale < 1) {
                this.picture.node.setScale(imgScale);
            }
            this.picture.node.runAction(cc.sequence(cc.scaleTo(0.4,1.15 * imgScale),cc.scaleTo(0.4,1.0 * imgScale)));
            this.audioAuration = cardInfo["audio_duration"];
            cc.log('this.audioAuration: ' + this.audioAuration);
            this.playSoundHelp();
        }.bind(this));
    },

    touchLetter: function () {
        if (this.blockTouchLeteer) {
            cc.log("Da touch vao letter roi");
            return;
        }
        this.btnSound.node.active = false;
        this.blockTouchLeteer = true;
        var mp3File = 'Sound/card/' + GameData.gameCard.cardData["text"].toLowerCase() + '.mp3';
        this.addResourcePath(mp3File);
        Utils.playSoundSource(mp3File, false,true);
        {
            var sequence = [];
            sequence.push(cc.delayTime(1.2));
            var pos_move=this.ovuong.node.getPosition();
            pos_move.y-=12;
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

        //var callFunc=cc.callFunc(this.playKidsSayYay,this);
        this.ovuong.node.runAction(cc.sequence(cc.scaleTo(0.4,1.3),cc.scaleTo(0.4,1.0)));
        this.lblTouch.node.runAction(cc.sequence(cc.scaleTo(0.4,1.3),cc.scaleTo(0.4,1.0)));
        //this.node.stopAllActions();
        //this.node.runAction(cc.sequence(cc.delayTime(this.audioAuration + 0.1),callFunc));

        var callFunc=cc.callFunc(this.nextCard,this);
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(1.0),callFunc));
    },


    playKidsSayYay: function () {
        var effect = cc.instantiate(this.particleEffect);
        effect.name = "success_effect";
        effect.x = 0;
        this.node.addChild(effect);

        var mp3File = 'Sound/gamevoice/wc.mp3';
        this.addResourcePath(mp3File);
        Utils.playSoundSource(mp3File, false,true);

        var callFunc=cc.callFunc(this.exitGame,this);
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(3.0),callFunc));
    },

    nextCard: function () {
        GameData.gameCard.cardIndex++;
        this.playKidsSayYay();
    },

    exitGame: function () {
        GameData.nextGame();
    },


    touchBackground: function () {
        if (!this.blockTouchLeteer) {

        }
    },

    actionCloseButton:function(){
        if(this.isClosed){
            return;
        }
        this.isClosed=true;
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3",false,true);
        cc.director.setClearColor(cc.Color.WHITE);
        this.node.runAction(cc.fadeTo(0.4,0));

        this.scheduleOnce(this.gotoHomePage,0.5);
    },
    gotoHomePage:function(){
        cc.director.loadScene("MainSC");
    },
    actionReloadButton:function(){
        var mp3File = 'Sound/card/' + this.cardName + '.mp3';
        this.addResourcePath(mp3File);
        Utils.playSoundSource(mp3File, false,true);
    },

});
