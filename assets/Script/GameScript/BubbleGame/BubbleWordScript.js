var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        colorWord:{
            type:cc.Color,
            default:[]
        }
    },

    getRandomBubbleWord:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },



    onLoad: function () {
        var scsize=cc.director.getVisibleSize();
        var biendo=scsize.width/2-100;
        var dtx=this.getRandomBubbleWord(0,biendo);
        if(this.getRandomBubbleWord(0,10)>=5){
            dtx=-dtx;
        }
        this.node.x=dtx;
        this.node.y=-460;
        this.v_y=this.getRandomBubbleWord(100,300);
        this.stopmove=false;
        this.blockTap=false;


        var rdid=this.getRandomBubbleWord(1,7);
        this.source_path_bubble="GameTouch/game_02_bubble_0"+rdid+".png";
        var child_mask=this.node.getChildByName("sp_bubble");
        Utils.setSpriteFrame(child_mask.getComponent(cc.Sprite), this.source_path_bubble);

        var idcolor=this.getRandomBubbleWord(0,4);
        var childNodelb=this.node.children[0];
        childNodelb.color=this.colorWord[idcolor];
        if (Math.round(Math.random()*10)>=5){
            childNodelb.getComponent(cc.Label).string=this.node.word_name.toUpperCase();
        }else {
            childNodelb.getComponent(cc.Label).string=this.node.word_name;
            childNodelb.scale=1.3;
        }
    },



    stopMoveNode:function(){
        if(this.blockTap){
            return;
        }
        this.stopmove=true;
        this.blockTap=true;
        this.node.removeComponent(cc.Button);
        var spbb=this.node.children[1];
        spbb.runAction(cc.fadeTo(0.3,0));
        var spcard=this.node.children[0];
        spcard.runAction(cc.sequence(cc.scaleTo(0.5,0.6),cc.delayTime(0.8),cc.fadeTo(0.3,0)));

        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(this.removeMe,this)));
    },

    removeMe:function(){
        this.stopmove=true;
        this.node.removeAllChildren(true);
        this.node.removeFromParent(true);
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.stopmove){
            return;
        }
        this.node.y+=this.v_y*dt;
        if(this.node.y>480){
            this.stopmove=true;
            this.node.removeAllChildren(true);
            this.node.removeFromParent(true);
            this.node.destroy();
        }
    },
});
