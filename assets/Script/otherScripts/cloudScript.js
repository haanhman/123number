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

    getRandomSpeed:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // use this for initialization
    onLoad: function () {
        this.speed=this.getRandomSpeed(20,60);
    },

    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
         this.node.x-=dt*this.speed;
         if(this.node.x<-680){
             this.node.x=680;
         }
     },
});
