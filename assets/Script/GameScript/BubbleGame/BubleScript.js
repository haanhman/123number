cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    getRandomBubble:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },



    onLoad: function () {
        var scsize=cc.director.getVisibleSize();
        var biendo=scsize.width/2-100;
        var dtx=this.getRandomBubble(0,biendo);
        if(this.getRandomBubble(0,10)>=5){
            dtx=-dtx;
        }
        this.node.x=dtx;
        this.node.y=-460;
        this.v_y=this.getRandomBubble(100,300);
        this.stopmove=false;
        this.blockTap=false;


        // lay ra random anh tu 1 den 7
        var rdid=this.getRandomBubble(1,7);
        // lay ten file, phai luu lai thanh bien this.source_path_bubble de con release
        // release o dong thu 23
        var source_path_bubble="GameTouch/game_02_bubble_0"+rdid;
        var self=this;
        cc.loader.loadRes(source_path_bubble,cc.SpriteFrame, function (err, rsdata) {
            if(!(err==null)){
                cc.log("----error load word  %s = %s ",err,rd_index);
                return;
            }
            var child_mask=self.node.getChildByName("sp_bubble");
            child_mask.getComponent(cc.Sprite).spriteFrame=rsdata;
        });



        cc.loader.loadRes(this.node.pathIMG,cc.SpriteFrame, function (err, rsdata) {
            if(!(err==null)){
                cc.log("----error load word  %s = %s ",err,rd_index);
                return;
            }
            var child_card=self.node.getChildByName("card");
            child_card.getComponent(cc.Sprite).spriteFrame=rsdata;
        });





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
