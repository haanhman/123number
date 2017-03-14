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
        cc.loader.loadRes("Sound/gametouch/ta", function (err, audiofile) {
            //cc.log("----  %s ",err);
            cc.audioEngine.stopAll();
            cc.audioEngine.playEffect(audiofile);
        });


    },

    onDisable: function onDisable() {// bat buoc phai co de giai phong bo nho
        cc.loader.releaseRes("Sound/gametouch/ta");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
