cc.Class({
    extends: cc.Component,

    properties: {
        soundTouch:cc.AudioClip,
    },

    // use this for initialization
    onLoad: function () {
        this.playSoundTouch();
    },

    playSoundTouch:function(){
        cc.audioEngine.stopAll();
        cc.audioEngine.playEffect(this.soundTouch);
    },



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
