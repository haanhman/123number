cc.Class({
    extends: cc.Component,

    properties: {
        colorArr: {
            type: cc.Color,
            default: []
        },
        arrFrm:{
            type:cc.SpriteFrame,
            default:[]
        }
    },
    getRandomYSpeed:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // use this for initialization
    onLoad: function () {
        this.stopmove=false;
        this.yspeed=this.getRandomYSpeed(30,150);
        this.node.y=-140;
        this.node.x=550-this.getRandomYSpeed(0,1110);
        var sc=this.getRandomYSpeed(4,8);
        this.node.scale=sc/10;

        var allWord=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","Y","X","Z"];
        var ridx=this.getRandomYSpeed(0,25);
        this.node.children[1].getComponent(cc.Label).string=allWord[ridx];
        this.node.children[1].color=this.colorArr[this.getRandomYSpeed(0,5)];
        this.node.children[0].getComponent(cc.Sprite).spriteFrame=this.arrFrm[this.getRandomYSpeed(0,4)];
    },


    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
         if(this.node.y>180){
             if(this.stopmove){
                 return;
             }
             this.stopmove=true;
             this.node.removeAllChildren(true);
             this.node.removeFromParent(true);
             this.node.destroy();
             //cc.log("----removeFromParentremoveFromParent ---");
             return;
         }

         this.node.y+=this.yspeed*dt;

     },
});
