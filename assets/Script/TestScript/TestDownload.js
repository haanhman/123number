
var NativeMobileJS = require('NativeMobile');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        lbdownload:cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.pr=0;
        NativeMobileJS.scriptReceiveDownload=this;


    },
    onDisable: function() {// bat buoc phai co de giai phong bo nho
        NativeMobileJS.scriptReceiveDownload=null;
    },

    actionStart:function(){
        //Utils.beginDownloadFile(Utils.getUrlDownload('a'));
        var animation=this.node.getComponent(cc.Animation);
        //animation.play();
        animation.play('at1');
    },
    actionStop:function(){

    },

    //--------download delegate----
    nativedownloadProgess:function(prdownload){
        this.lbdownload.string="Downloading: "+prdownload+" %";
    },
    errorDownload:function(status){
        this.lbdownload.string="errorDownload";
    },
    finishDownload:function(status){
        this.lbdownload.string="finishDownload";
    },
    //------end delegate -----

    // called every frame, uncomment this function to activate update callback
     update: function (dt) {

     },
});
