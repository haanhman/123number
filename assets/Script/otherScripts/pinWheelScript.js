var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

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

    getRandomTime:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // use this for initialization
    onLoad: function () {
        var rdtime=this.getRandomTime(1,3);
        if(this.node.name=="sun"){
            rdtime=12;
        }
        this.node.runAction(cc.repeatForever(cc.rotateBy(rdtime,360)));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
