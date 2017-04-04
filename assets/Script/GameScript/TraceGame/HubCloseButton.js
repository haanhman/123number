var Utils = require('Utils');
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
