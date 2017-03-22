var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        bubbleNode:cc.Prefab,
        bubbleLabel:cc.Prefab,
        effect_touch:cc.Prefab,
        cloudNode:cc.Node,
        eventButton:cc.Component.EventHandler,

    },

    getRandomTime:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
        cc.audioEngine.stopAll();
    },

    // use this for initialization
    onLoad: function () {
        //var bt=this.node.getChildByName("Bubble");
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

        this.word_name=Utils.play_game_letter;
        if (typeof (this.word_name)=="undefined"){
            this.word_name="d";
            //khong bao gio xay ra truong hop nay, cai nay chi de test thoi
        }

        var json_path="cards/"+this.word_name+".json";
        this.addResourcePath(json_path);
        var self=this;
        Utils.loadJson(json_path, function (jsonResponse) {
            self.arrayCard=jsonResponse.images;
            self.allowLoad=true;
        }.bind(this));

        var soundms_bg="Sound/msbg/simplemsbg.mp3";
        this.addResourcePath(soundms_bg);
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
        this.addResourcePath(source_path);
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
                 this.addResourcePath(spbutton.audioPath);
             }else{
                 spbutton=cc.instantiate(this.bubbleNode);
                 //spbutton.arrayCard=this.arrayCard;

                 var crCard=this.arrayCard[this.getRandomTime(0,this.arrayCard.length-1)];
                 spbutton.audioPath="Sound/card/"+crCard.card_name+".mp3";
                 this.addResourcePath(spbutton.audioPath);

                 spbutton.pathIMG="cards/"+crCard.card_name+this.getRandomTime(1,Math.floor(crCard.total_image))+".png";
                 this.addResourcePath(spbutton.pathIMG);

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

        this.blockLoad=false;
        // show ra chuc mung
        this.scheduleOnce(this.loadNextScene,3);
    },
    loadNextScene:function(){
        //cc.log("-------asdlhaskjdksa load next+"+ Math.random());
        if(this.blockLoad){
            return;
        }
        this.blockLoad=true;
        if (typeof (Utils.arrScene)=="undefined"){
            return;
        }
        if(Utils.arrScene.length<=Utils.index_sc){

            cc.director.loadScene("MainSC");
        }{
            var nextScName=Utils.arrScene[Utils.index_sc];
            Utils.index_sc++;
            cc.director.loadScene(nextScName);
        }


    },
});
