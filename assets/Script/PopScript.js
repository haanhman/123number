var Utils = require('Utils');
var NativeMobileJS = require('NativeMobile');
cc.Class({
    extends: cc.Component,
    properties: {
        cardSprite: {
            type: cc.Sprite,
            default: null
        },
        strCardName: {
            default: "A"
        },
        btnWrite: cc.Sprite,
        btnSong: cc.Sprite,
        btnLearn: cc.Sprite,
        btnDownload: cc.Sprite,
        btnBuy: cc.Sprite,
        btnClose: cc.Sprite,
        //download
        downloadPanel: cc.Node,
        progressBar: cc.ProgressBar,
        lblPercent: cc.Label,

        lbtitle: cc.Label
    },

    validateCardInfo: function () {
        this.downloadPanel.active = false;
        this.btnWrite.node.active = false;
        this.btnSong.node.active = false;
        this.btnLearn.node.active = false;
        this.btnDownload.node.active = false;
        this.btnBuy.node.active = false;


        var showContent = false;
        var freeCard = ["a", "b", "c", "d"];
        if (freeCard.indexOf(this.selectedLetter) >= 0) {
            showContent = true;
        }

        if (!showContent) {
            var vkids_buy_content = cc.sys.localStorage.getItem('vkids_buy_content');
            vkids_buy_content = true;
            if (vkids_buy_content == undefined || !vkids_buy_content) {
                this.btnBuy.node.active = true;
            } else {
                //kiem tra neu download roi thi hien thi cac nut cho choi, chua download thi phai download ve da
                var checkDownload = "download_pack_" + this.selectedLetter;
                var download = cc.sys.localStorage.getItem(checkDownload);
                if (download == undefined || !download) {
                    this.btnDownload.node.active = true;
                } else {
                    showContent = true;
                }
            }
        }

        this.btnWrite.node.active = showContent;
        this.btnSong.node.active = showContent;
        this.btnLearn.node.active = showContent;


    },

    addTouchListenEvent: function () {

        this.touchListen = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: true,
            onTouchBegan: function (touch, event) {
                cc.log("-------this.name: " + this.node.name);
                return true;
            }.bind(this),

        }, this.node);

    },

    // use this for initialization
    onLoad: function () {
        this.selectedLetter = '';
        this.addTouchListenEvent();
        NativeMobileJS.scriptReceiveDownload = this;
    },
    onDisable: function onDisable() {
        NativeMobileJS.scriptReceiveDownload = null;
        cc.eventManager.removeListener(this.touchListen);


        // cc.eventManager.removeAllListeners();
    },

    actionCloseButton: function () {
        //
        var animation = this.node.getComponent("cc.Animation");
        animation.play("movedown");

        var callFun = cc.callFunc(this.removeMeFromParrent, this);
        var delay = cc.delayTime(0.4);
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(delay, callFun));
    },
    removeMeFromParrent: function () {
        this.node.removeFromParent(true);
        this.node.destroy();
    },


    getRandomInt:function (min, max) { 
        return Math.floor(Math.random() * (max - min + 1)) + min;
     },
    actionPlayGame: function () {
        Utils.play_game_letter = this.selectedLetter.toLowerCase();
        var latter = this.selectedLetter;
        Utils.index_sc = 0;

        //random thu tu game

        var arrloadsc=[];
        arrloadsc[0]="Trace" + latter.toUpperCase();
        arrloadsc[1]="Trace" + latter + "_low";
        arrloadsc[2]="Game_Touch";
        arrloadsc[3]="Game_Touch";
        arrloadsc[4]="Game_Touch";
        arrloadsc[5]="GameWord";
        Utils.arrScene = [];

        while (arrloadsc.length>=1){
            var ir=this.getRandomInt(0,arrloadsc.length-1);
            var obj_tmp=arrloadsc[ir];
            cc.log("----: %s",obj_tmp);
            Utils.arrScene.push(obj_tmp);
            arrloadsc.splice(ir,1);
        }

        Utils.arrScene.push("GameBongBay");


        //Utils.arrScene.push("GameBongBay");
        cc.log("--------: %s",Utils.arrScene.length);;
        //Utils.arrScene = ["Game_Touch"];
        //SlideInRTransition(t, s);

        var namesc = Utils.arrScene[Utils.index_sc];

        Utils.index_sc++;

        cc.director.loadScene(namesc);





    },
    actionPlaySong: function () {
        Utils.playVideoForCard('video/' + this.strCardName.toLowerCase() + '_song.mp4');
        this.actionShowBgNoTouch(true);
        this.node.removeFromParent(true);
    },

    actionTraceVideo: function () {
        Utils.playVideoForCard('video/' + this.strCardName.toLowerCase() + '_trace.mp4');
        this.actionShowBgNoTouch(true);
        this.node.removeFromParent(true);
    },

    actionShowBgNoTouch: function (active) {
        this.node.parent.getComponent("HomeUIScript").activeBgNoTouch(active);
    },

    actionDownload: function () {
        Utils.beginDownloadFile(Utils.getUrlDownload(this.strCardName.toLowerCase()));
        this.btnDownload.node.active = false;
        this.downloadPanel.active = true;
        this.btnClose.node.active = false;
    },

    actionBuy: function () {

    },

    onDestroy: function () {

    },

    //--------download delegate----
    nativedownloadProgess: function (prdownload) {
        this.lblPercent.string = prdownload + "%";
        this.progressBar.progress = (prdownload / 100);
    },
    errorDownload: function (status) {
        this.btnClose.node.active = true;
    },
    finishDownload: function (status) {
        this.btnClose.node.active = true;
        var checkDownload = "download_pack_" + this.selectedLetter;
        cc.sys.localStorage.setItem(checkDownload, true);
        this.validateCardInfo();
    },
    //------end delegate -----

});
