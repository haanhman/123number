var Utils = require('Utils');
var GameData = require('GameData');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        bubbleNode:cc.Prefab,
        bubbleLabel:cc.Prefab,
        effect_touch:cc.Prefab,
        cloudNode:cc.Node,
        eventButton:cc.Component.EventHandler,
        hubNode:cc.Node,
        lbHubFinish:cc.Label,

    },

    getRandomTime:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    onDisable: function() {
        cc.audioEngine.stopAll();
    },

    // use this for initialization
    onLoad: function () {
        //var bt=this.node.getChildByName("Bubble");
        this.isClosed=false;
        this.hubNode.active=false;
        this.index_countRS=0;
        this.arrRS=[];

        var allcound=this.cloudNode.children;
        var count_cloud=this.cloudNode.childrenCount;
        for(var ic=0;ic<count_cloud;ic++){
            var c_cloud=allcound[ic];
            var timej=this.getRandomTime(6,12);
            c_cloud.runAction(cc.repeatForever(cc.jumpBy(timej, cc.p(0, 0), 20, 4)));
        }

        this.time_count=2;

        this.allowLoad=false;

        this.word_name=GameData.playGameLetter;
        if (typeof (this.word_name)=="undefined"){
            this.word_name="d";
            //khong bao gio xay ra truong hop nay, cai nay chi de test thoi
        }

        var self=this;
        self.arrayCard = GameData.jsonData.images;
        self.allowLoad=true;

        var soundms_bg="Sound/msbg/simplemsbg.mp3";
        Utils.playSoundSource(soundms_bg,true,true);

        this.coundBubble=0;
        this.blockCallFun=false;
    },


    actionClickBubble:function(nodebutton){
        var namebutton = nodebutton.target.name;
        var btNode=nodebutton.target;
        var scriptButton=btNode.getComponent("BubleScript");
        if(scriptButton==null){
            scriptButton=btNode.getComponent("BubbleWordScript");
        }
        scriptButton.stopMoveNode();

        var effect=cc.instantiate(this.effect_touch);
        effect.x=btNode.x;
        effect.y=btNode.y;
        this.node.addChild(effect);

        this.coundBubble++;
        if(this.coundBubble>15){

        }

        var source_path=btNode.audioPath;
        Utils.playSoundSource(source_path, false, false);
    },




    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
         if(!this.allowLoad){
             return;
         }
         if(this.coundBubble>15){
             this.stopUpdate();
             return;
         }
         this.time_count+=dt;
         if(this.time_count>=1){
             this.time_count=0;

             var spbutton=null;
             if(Math.floor(Math.random()*10)>=5){
                 spbutton=cc.instantiate(this.bubbleLabel);
                 spbutton.word_name=this.word_name;
                 spbutton.audioPath="Sound/card/"+this.word_name+".mp3";
             }else{
                 spbutton=cc.instantiate(this.bubbleNode);
                 var crCard=this.arrayCard[this.getRandomTime(0,this.arrayCard.length-1)];
                 spbutton.audioPath="Sound/card/"+crCard.card_name+".mp3";
                 spbutton.pathIMG="cards/"+crCard.card_name+this.getRandomTime(1,Math.floor(crCard.total_image))+".png";
             }
             var btcom=spbutton.getComponent(cc.Button);
             btcom.clickEvents=[this.eventButton];
             this.node.addChild(spbutton);
         }
     },


    stopUpdate:function(){
        if(this.blockCallFun){
            return;
        }
        this.blockCallFun=true;
        // show ra chuc mung
        this.scheduleOnce(this.actionShowHubFinish,3);
    },

    actionCloseGame:function(){
        if(this.isClosed){
            return;
        }
        this.isClosed=true;
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3",false,true);
        cc.director.setClearColor(cc.Color.WHITE);
        this.scheduleOnce(this.loadNextScene,1.5);

        this.node.runAction(cc.fadeTo(1.0,0));
    },

    actionShowHubFinish:function(){
        this.hubNode.active=true;
        var animationhub=this.hubNode.getComponent(cc.Animation);
        animationhub.play("animationBubblegame");
        this.lbHubFinish.string=GameData.playGameLetter.toUpperCase();
        this.scheduleOnce(this.playAudioGroup,0.8);

        this.node.getChildByName("buttonClosetop").active=false;
    },

    playAudioGroup:function(){
        Utils.playSoundSource("groupaudio/"+GameData.playGameLetter+".mp3",false,false);
    },


    loadNextScene:function(){
        GameData.nextGame();
    },
});
