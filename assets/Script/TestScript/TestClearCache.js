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
        this.ttad=0;
    },
    clearDataCache:function(){
        cc.log("---clear cache ");
        cc.textureCache.removeAllTextures();
    },

    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
         this.ttad=this.ttad+dt;
         if(this.ttad>3){
            this.ttad=0;
            this.clearDataCache();
         }
     },
});
