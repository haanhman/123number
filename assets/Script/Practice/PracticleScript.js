cc.Class({
    extends: cc.Component,

    properties: {
        centerNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        if(this.node.width<1000){
            this.centerNode.scale=0.85;
        }
    },


    actionNumber123:function(){
        cc.director.loadScene("P_number123.fire");
    },
    actionWordNumber123:function(){

    },
    actionCount123:function(){
        cc.director.loadScene("P_count.fire");
    },
    actionCompare123:function(){
        cc.director.loadScene("P_compare.fire");

    },
    actionReadNumber:function(){

    },
    actionNumberLine:function(){

    },

});
