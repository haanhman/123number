var Utils = require('Utils');
var NativeMobileJS = require('NativeMobile');
var GameData = require('GameData');
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
        btnRate: cc.Sprite,
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
        this.btnRate.node.active = false;


        var showContent = false;

        var limitFree = Utils.limitFree();
        var limitRateToUnlock = Utils.limitRateToUnlock();

        if (limitFree.indexOf(this.selectedLetter) >= 0) {
            showContent = true;
        }

        if (!showContent) {
            if (limitRateToUnlock.indexOf(this.selectedLetter) >= 0) {
                if (Utils.checkRateApp()) {
                    //neu download roi thi show 3 nut ra de choi
                    if (Utils.checkDownload(this.selectedLetter)) {
                        showContent = true;
                    } else {
                        this.btnDownload.node.active = true;
                    }
                } else {
                    this.btnRate.node.active = true;
                }
            } else {
                if (Utils.isUnlockContent()) {
                    //kiem tra neu download roi thi hien thi cac nut cho choi, chua download thi phai download ve da
                    if (Utils.checkDownload(this.selectedLetter)) {
                        showContent = true;
                    } else {
                        this.btnDownload.node.active = true;
                    }
                } else {
                    this.btnBuy.node.active = true;
                }
            }
        }

        this.btnWrite.node.active = showContent;
        this.btnSong.node.active = showContent;
        this.btnLearn.node.active = showContent;
    },

    rateToDownload: function () {
        var parentScript = this.node.parent.getComponent('HomeUIScript');
        parentScript.actionRate();
        this.node.removeFromParent(true);
    },

    addTouchListenEvent: function () {

        this.touchListen = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: true,
            onTouchBegan: function (touch, event) {
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
        Utils.removeUnusedSpriteFrames();
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


    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    actionPlayGame: function () {
        GameData.playGameLetter = this.selectedLetter.toLowerCase();
        var latter = this.selectedLetter;
        GameData.restartGameData();


        var jsonUrl = 'cards/' + GameData.playGameLetter + '.json';
        Utils.loadJson(jsonUrl, function (jsonResponse) {
            GameData.jsonData = jsonResponse;

            GameData.gameCard.cardData.text = jsonResponse.text;
            var tmp = jsonResponse.images;
            Utils.arrayShuffle(tmp);

            //chi lay 2 card ra de choi thoi
            GameData.gameCard.cardData.images = tmp.slice(0, 2);

            //random thu tu game
            GameData.arrayScene = [];
            GameData.arrayScene.push("Trace" + latter.toUpperCase())
            GameData.arrayScene.push("Trace" + latter + "_low")
            GameData.arrayScene.push("Game_Touch")
            GameData.arrayScene.push("Game_Touch")
            GameData.arrayScene.push("Game_Touch")
            GameData.arrayScene.push("GameWord")
            GameData.arrayScene.push("GameWord")
            Utils.arrayShuffle(GameData.arrayScene);
            GameData.arrayScene.push("GameBongBay");

            var gameScene = GameData.arrayScene[GameData.gameIndex];
            GameData.gameIndex++;
            cc.director.loadScene(gameScene);
        }.bind(this));
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
        this.node.parent.getComponent("HomeUIScript").addParentalPopup('download', this);
    },

    downloadNow: function () {
        Utils.beginDownloadFile(Utils.getUrlDownload(this.strCardName.toLowerCase()));
        this.btnDownload.node.active = false;
        this.downloadPanel.active = true;
        this.btnClose.node.active = false;
    },

    stopDownload: function () {
        Utils.stopDownload();
        this.nativedownloadProgess(0);
        this.btnDownload.node.active = true;
        this.downloadPanel.active = false;
        this.btnClose.node.active = true;
    },

    actionBuy: function () {
        var parentScript = this.node.parent.getComponent('HomeUIScript');
        parentScript.actionBuyAll();
        this.node.removeFromParent(true);
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
        this.node.parent.getComponent("HomeUIScript").reloadAllCard();
    },
    //------end delegate -----

});
