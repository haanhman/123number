var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.isClosed=false;
    },

    actionCloseButton:function(){
        if(this.isClosed){
            return;
        }

        this.isClosed=true;
        this.node.stopAllActions();
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3",false,true);
        cc.director.setClearColor(cc.Color.WHITE);

        this.node.parent.getComponent("TraceGameScript").exitGame();
    }
});
