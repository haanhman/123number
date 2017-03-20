var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        cardSprite:{
            type:cc.Sprite,
            default:null
        },
        strCardName:{
            default:"A"
        },

        lbtitle:cc.Label
    },
    addTouchListenEvent:function(){

        this.touchListen=cc.eventManager.addListener({event: cc.EventListener.TOUCH_ONE_BY_ONE,swallowTouches: true,
            onTouchBegan: function(touch, event) {
                cc.log("-------this.name: "+this.node.name);
                return true;
            }.bind(this),

        }, this.node);

    },

    // use this for initialization
    onLoad: function () {
        this.selectedLetter = '';
        this.addTouchListenEvent();
    },
    onDisable: function onDisable() {
        cc.log("---------onDisable");
        cc.eventManager.removeListener(this.touchListen);


        // cc.eventManager.removeAllListeners();
    },

    actionCloseButton: function () {
        //
        var animation=this.node.getComponent("cc.Animation");
        animation.play("movedown");

        var callFun=cc.callFunc(this.removeMeFromParrent,this);
        var delay=cc.delayTime(0.4);
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(delay,callFun));
    },
    removeMeFromParrent:function(){
        this.node.removeFromParent(true);
        this.node.destroy();
    },


    actionPlayGame:function(){
        cc.sys.localStorage.setItem('play_game_letter', this.selectedLetter);
        cc.director.loadScene('GameSc/GameWord');
    },
    actionPlaySong:function(){
        var videoPath = Utils.getFilePath('resources/video/'+ this.strCardName.toLowerCase() +'_song.mp4')
        Utils.playVideoForCard(videoPath);
    },

    actionTraceVideo:function(){
        var videoPath = '';
        if(this.strCardName.toLowerCase() == 'z') {
            var listVideo = ["z_trace1.mp4", "z_trace2.mp4"];
            Utils.arrayShuffle(listVideo);
            videoPath = Utils.getFilePath('resources/video/'+ listVideo[0]);
        } else {
            videoPath = Utils.getFilePath('resources/video/'+ this.strCardName.toLowerCase() +'_trace.mp4')
        }
        Utils.playVideoForCard(videoPath);
    },

    onDestroy:function(){

    },

});
