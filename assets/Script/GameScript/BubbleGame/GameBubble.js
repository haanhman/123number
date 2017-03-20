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
        var source_exits=false;
        for(var is=0;is<this.arrRS.length;is++){
            if(this.arrRS[is]==str_path){
                source_exits=true;
                break;
            }
        }
        if(!source_exits){
            this.arrRS[this.index_countRS]=str_path;
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

        this.word_name="b";
        var json_path="cards/"+this.word_name+".json";
        this.addResourcePath(json_path);
        var self=this;
        cc.loader.loadRes(json_path, function (err, rsdata) {
            if(!(err==null)){
                cc.log("----error load word  %s = ",err);
                return;
            }
            //console.log("------rsdata: "+rsdata);
            //return;
            self.arrayCard=rsdata.images;
            self.allowLoad=true;
        });

        var soundms_bg="Sound/msbg/simplemsbg.mp3";
        this.addResourcePath(soundms_bg);
        cc.loader.loadRes(soundms_bg,cc.AudioClip, function (err, audiofile) {
            if(!(err==null)){
                cc.log("----error load word  %s ",err);
            }

            cc.audioEngine.stopAll();
            cc.audioEngine.play(audiofile,true);
        });

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



        var source_path=btNode.audioPath;
        this.addResourcePath(source_path);
        cc.loader.loadRes(source_path,cc.AudioClip, function (err, audiofile) {
            if(!(err==null)){
                cc.log("----error load word  %s ",err);
            }

            cc.audioEngine.play(audiofile);
        });
    },


    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
         if(!this.allowLoad){
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
});
