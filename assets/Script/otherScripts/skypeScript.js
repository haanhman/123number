cc.Class({
    extends: cc.Component,

    properties: {
        bbPrefab:cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        this.stepCount=0;
    },

     //called every frame, uncomment this function to activate update callback
     update: function (dt) {
         this.stepCount+=dt;
         if(this.stepCount>0.5){
             this.stepCount=0;
             var cc_count=this.node.childrenCount;
             if(cc_count<17){
                 var bbnode_tmp=cc.instantiate(this.bbPrefab);
                 this.node.addChild(bbnode_tmp);
             }
         }
     },
});
