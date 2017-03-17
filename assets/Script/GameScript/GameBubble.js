cc.Class({
    extends: cc.Component,

    properties: {
        bubbleNode:cc.Prefab,
        effect_touch:cc.Prefab,
        cloudNode:cc.Node,
        eventButton:cc.Component.EventHandler,

    },

    getRandomTime:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // use this for initialization
    onLoad: function () {
        //var bt=this.node.getChildByName("Bubble");

        var allcound=this.cloudNode.children;
        var count_cloud=this.cloudNode.childrenCount;
        for(var ic=0;ic<count_cloud;ic++){
            var c_cloud=allcound[ic];
            var timej=this.getRandomTime(6,12);
            c_cloud.runAction(cc.repeatForever(cc.jumpBy(timej, cc.p(0, 0), 20, 4)));
        }



        this.time_count=0;
    },


    actionClickBubble:function(nodebutton){
        var namebutton = nodebutton.target.name;
        var btNode=nodebutton.target;
        var scriptButton=btNode.getComponent("BubleScript");
        scriptButton.stopMoveNode();

        var effect=cc.instantiate(this.effect_touch);
        effect.x=btNode.x;
        effect.y=btNode.y;
        this.node.addChild(effect);
    },


    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
         this.time_count+=dt;
         if(this.time_count>1){
             this.time_count=0;
             var spbutton=cc.instantiate(this.bubbleNode);
             var btcom=spbutton.getComponent(cc.Button);
             btcom.clickEvents=[this.eventButton];
             this.node.addChild(spbutton);
         }
     },
});
