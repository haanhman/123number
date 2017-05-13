cc.Class({
    extends: cc.Component,

    properties: {
        lbNumber:cc.Label,

    },

    // use this for initialization
    onLoad: function () {

    },


    actionClose:function(){
        cc.director.loadScene("LearnSC.fire");
    },
    actionNext:function(){

    },
    actionBack:function(){

    },
    actionSound:function(){

    },

});
