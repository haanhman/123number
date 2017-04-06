var Utils = require('Utils');
var GameData = require('GameData');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        drawNodeContent:cc.Node,
        particleEffect:cc.Prefab,
        helpNode:{
            type:cc.Node,
            default:[]
        }
    },


    update: function (dt) {
        this.timeAddDot=this.timeAddDot+dt;
    },

    // use this for initialization
    onLoad: function () {
        this.timeAddDot=0;
        this.scSize=cc.director.getVisibleSize();
        //this.scheduleOnce(this.loadConfigGame,0.5);
        this.loadgame=false;
        this.loadConfigGame();
        var allchildx=this.node.children;
        for(var cid in allchildx){
            var tmp_node=allchildx[cid];
            if(tmp_node.name=="reloadbutton"||tmp_node.name=="bgNode"){
                continue;
            }
            var cposx=tmp_node.x;
            tmp_node.x=this.scSize.width/2;
            tmp_node.runAction(cc.moveTo(0.3,cc.p(cposx,tmp_node.y)));
        }
        this.playAudioGame();
        this.loadConfigButton();
    },


    loadConfigButton:function(){
        var button_reload=this.node.getChildByName("reloadbutton");
        var widget_cpn=button_reload.getComponent(cc.Widget);
        widget_cpn.isAlignRight=false;
        widget_cpn.isAlignLeft=true;
        widget_cpn.left=28;

        var self=this;
        cc.loader.loadRes("PrefabGame/HubCloseButton",cc.Prefab, function (err, prefab_file) {
            if (!(err == null)) {
                cc.log("----err===  %s ", err);
                return;
            }
            var node_tmp = cc.instantiate(prefab_file);
            self.node.addChild(node_tmp);
        });


    },

    playAudioGame:function(){
        var rid=Math.floor(Math.random()*10)>5?1:0;
        var soundms_bg="Sound/gamevoice/trace"+rid+".mp3";
        Utils.playSoundSource(soundms_bg,false,false);
        this.scheduleOnce(this.playNextSoundCard,1.8);
    },
    playNextSoundCard:function(){
        var allWord=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","Y","X","Z"];
        var letter=GameData.playGameLetter;
        if(letter==null||(typeof(letter )=="undefine")){
            letter="B";
        }
        var index_letter=allWord.indexOf(letter.toUpperCase());
        index_letter=index_letter+1;
        var soundms_bg="Sound/speak/"+index_letter+"e.mp3";
        Utils.playSoundSource(soundms_bg,false,false);
    },

    loadConfigGame:function(){
        if(this.loadgame){
            return;
        }
        this.loadgame=true;

        this.size_screen=cc.p(568,320);
        this.index_trace=0;

        this.indexDraw=[];
        for(var ii=0;ii<10;ii++){
            this.indexDraw[ii]=0;
        }

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
        }, this.node);

        this.scriptDraw=this.drawNodeContent.getComponent("TraceGameDaw");

        this.createMask();
        this.scheduleOnce(this.loadHelp,0.5);


    },





    onDisable: function onDisable() {
        this.scriptDraw=null;
    },

    actionReload:function(){
        this.index_trace=0;
        this.indexDraw=[];
        for(var ii=0;ii<10;ii++){
            this.indexDraw[ii]=0;
        }

        var len_help=this.helpNode.length;
        for(var ih=0;ih<len_help;ih++){
            var tmp_help=this.helpNode[ih];
            var tmp_help_script=tmp_help.getComponent("TraceHelp");
            tmp_help_script.reloadHelp();
        }


        this.createMask();

        this.loadHelp();
        cc.audioEngine.stopAll();
        this.unscheduleAllCallbacks();
        this.playAudioGame();
    },

    loadHelp:function(){
        this.scriptDraw.loadNewPath();
        var len_help=this.helpNode.length;
        if(this.index_trace>=len_help){

            var handNode=this.node.getChildByName("bantay");
            handNode.stopAllActions();
            handNode.opacity=0;

            //finish
            var getLastOBJ=this.node.getChildByName("effectNode");

            if(getLastOBJ!=null){
                getLastOBJ.removeFromParent(true);
                cc.log("---removeFromParent");
                getLastOBJ=null;
            }

            this.node.getChildByName("reloadbutton").active = false;

            Utils.playSoundSource("Sound/gamevoice/wc.mp3",false,false);
            //Utils.playSoundSource("Sound/gamevoice/kids_say_yay.mp3",false,false);
            getLastOBJ=cc.instantiate(this.particleEffect);
            getLastOBJ.x=0;
            this.node.addChild(getLastOBJ);
            this.scheduleOnce(this.loadNextScene,3);
        }else{
            var current_help=this.helpNode[this.index_trace];

            var current_help_script=current_help.getComponent("TraceHelp");
            current_help_script.loadHelp();


            for(var ih=0;ih<len_help;ih++){
                this.helpNode[ih].opacity=0;

            }
            current_help.opacity=255;
        }

    },

    loadNextScene:function(){
        GameData.nextGame();
    },

    createMask:function(){
        var paths=[];
        var index_path=0;
        var len_help=this.helpNode.length;

        if(this.index_trace>=len_help){
            // cc.log("-------error: len_help= %s",len_help);
        }else{

            for(var ih=0;ih<len_help;ih++){
                var helpNode=this.helpNode[ih];
                var listPos=[];
                var dots=helpNode.children;
                var len_dot=helpNode.childrenCount;
                if(len_dot<=2){
                    // console.log("-----error len_dot= %s",len_dot);
                }
                for(var i_d=0;i_d<len_dot;i_d++){
                    var dot_node=dots[i_d];
                    listPos[i_d]=cc.p(dot_node.getPosition().x+this.size_screen.x,dot_node.getPosition().y+this.size_screen.y);
                }

                paths[index_path]=listPos;
                index_path++;
            }

        }
        this.scriptDraw.drawMask(paths);
    },




    onTouchBegan: function (touch, event) {
        var touchLoc = touch.getLocation();
        //touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);
        //cc.log("touchLoc: %s |  %s",touchLoc.x,touchLoc.y);
        //this.scriptDraw.sendonTouchBegan(touchLoc);



        this.activeDot(touchLoc);
        return true;
    },

    onTouchMoved: function (touch, event) {
        var touchLoc = touch.getLocation();
        touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);
        //this.scriptDraw.sendonTouchMoved(touchLoc);
        this.activeDot(touchLoc);
    },


    onTouchEnded: function (touch, event) {

        //this.scriptDraw.sendonTouchEnded();
        var count_p=this.helpNode.length;
        if(count_p<=this.index_trace){
            return;
        }

        var current_help_node=this.helpNode[this.index_trace];
        var count_dots=current_help_node.childrenCount;
        var current_index=this.indexDraw[this.index_trace];

        if(count_dots<=current_index){
            this.index_trace++;
            this.loadHelp();
        }
    },

    activeDot:function(poscheck){
        var count_p=this.helpNode.length;
        if(count_p<=this.index_trace){
            return;
        }

        poscheck=cc.p(poscheck.x-this.scSize.width/2,poscheck.y-this.scSize.height/2);
        var current_help_node=this.helpNode[this.index_trace];
        if(current_help_node.name=="onedot"){
            var count_dots=current_help_node.childrenCount;
            var alldot=current_help_node.children;
            for(var ipo=0;ipo<count_dots;ipo++){
                alldot[ipo].opacity=0;
            }
            var handNode=this.node.getChildByName("bantay");
            if(handNode.opacity>0){
                handNode.stopAllActions();
                handNode.opacity=0;
            }

            this.indexDraw[this.index_trace]=count_dots;
            this.scriptDraw.deActivePath(this.index_trace);
        }else{
            var count_dots=current_help_node.childrenCount;
            var current_index=this.indexDraw[this.index_trace];

            if(count_dots<=current_index){
                return;
            }

            var active_Dot=current_help_node.children[current_index];

            var distance=cc.pDistance(active_Dot.getPosition(),poscheck);

            if(distance<50){
                var handNode=this.node.getChildByName("bantay");
                if(handNode.opacity>0){
                    handNode.stopAllActions();
                    handNode.opacity=0;
                }
                if(this.timeAddDot>0.2){
                    this.timeAddDot=0;
                    var soundms_bg="Sound/gamevoice/wtd.mp3";
                    Utils.playSoundSource(soundms_bg,false,false);
                }


                active_Dot.isRemove=true;
                active_Dot.opacity=0;
                this.scriptDraw.deActiveDot(this.index_trace);
                this.indexDraw[this.index_trace]=current_index+1;
            }
        }



    },

    exitGame: function () {
        // this.drawNodeContent.getComponent("TraceGameDaw").removeFromParent(true);
        this.drawNodeContent.removeFromParent(true);
        this.node.getChildByName("gamebg").removeFromParent(true);
        this.node.getChildByName("Word").removeFromParent(true);
        this.node.getChildByName("bantay").removeFromParent(true);
        var sequence = [];
        var fadeTo = cc.fadeTo(0.4,0);
        var callFunc = cc.callFunc(function(){
            cc.director.loadScene("MainSC");
        });
        sequence.push(fadeTo);
        sequence.push(callFunc);
        this.node.runAction(cc.sequence(sequence));
    }

});
