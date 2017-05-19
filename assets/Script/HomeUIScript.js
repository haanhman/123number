var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
var API = require("Api");
cc.Class({
    extends: vkidsScene,

    properties: {
        parental: cc.Prefab,
        setting: cc.Prefab,
        btnBuy: cc.Sprite,
        SalePopup: cc.Prefab,
        learnLevel: cc.Sprite
    },


    onLoad: function () {
        if (cc.sys.os == cc.sys.OS_OSX) {
            cc.sys.localStorage.removeItem('vkids_buy_content');
            // cc.sys.localStorage.removeItem('vkids_rated');
            cc.sys.localStorage.removeItem('vkids_need_rate_app');
        }
        var level = Utils.getRangeNumber();
        var imgPath = "";
        if(level == 10) {
            imgPath = "Texture/IMGUI/btn_1to10.png";
        } else {
            imgPath = "Texture/IMGUI/btn_1to5.png";
        }
        Utils.setSpriteFrame(this.learnLevel, imgPath, undefined, true);

        this.checkRateConfig();
        if (Utils.isUnlockContent()) {
            this.removeBuyBtn();
        }
    },
    reloadAllCard: function () {
        cc.log('====> reloadAllCard <====');
    },
    removeBuyBtn: function () {
        this.btnBuy.node.removeFromParent(true);
    },

    actionShare: function () {
        this.addParentalPopup('share', this);
    },
    actionRate: function () {
        this.addParentalPopup('rate', this);
    },
    actionAddMore: function () {
        this.addParentalPopup('ourapp', this);
    },
    actionFeedback: function () {
        this.addParentalPopup('feedback', this);
    },
    actionBuyNow: function() {
        Utils.soundButton();
        this.addParentalPopup('buy', this);
    },
    actionRestore: function() {
        this.addParentalPopup('restore', this);
    },
    actionBuyAll: function () {
        this.addPrefabs(this.SalePopup, "sale_popup", undefined, this);
        return;
    },
    unlockDataSuccess: function () {
        cc.log("Nguoi dung da unlock data thanh cong");
        cc.sys.localStorage.setItem('vkids_buy_content', true);
        cc.sys.localStorage.setItem('vkids_rated', true);
        this.removeBuyBtn();
        this.reloadAllCard();
    },
    unlockDataError: function () {
        cc.log("Unlock data that bai");
    },



    
    start: function () {
        // this.checkInstallData();
        if(Utils.isUnlockContent() == null && Utils.loadProduct == false) {
            var callFun = cc.callFunc(this.loadProducts);
            var delayTime = cc.delayTime(3);
            this.node.runAction(cc.sequence([delayTime, callFun]));
        }
    },

    loadProducts: function () {
        cc.log("===> loadProducts");
        Utils.loadPackageInappPurchase();
        Utils.loadProduct = true;
    },

    /*
    checkInstallData: function () {
        if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_ANDROID) {
            var checkFileExist = Utils.getFilePath("resources/video/a_song.mp4");
            cc.log("checkFileExist: %s", checkFileExist);
            if (!jsb.fileUtils.isFileExist(checkFileExist)) {
                var callFunc = cc.callFunc(this.copyDataFromZipFile, this);
                this.node.stopAllActions();
                this.node.runAction(cc.sequence(cc.delayTime(1.0), callFunc));
            }
        }
    },
    copyDataFromZipFile: function () {
        this.addPrefabs(this.installData, "InstallDataPopup");

        var callFunc = cc.callFunc(function () {
            Utils.installCardData();
        }, this);
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(1.0), callFunc));
    },
    removePopupInstallData: function () {
        cc.log("removePopupInstallData");
        this.node.getChildByName("InstallDataPopup").removeFromParent(true);
    },
    */
    addParentalPopup: function (action, parent) {
        this.addPrefabs(this.parental, "parental", action, parent);
    },
    addPrefabs: function (prefabs, name, action, parent) {
        var popup = cc.instantiate(prefabs);
        if(parent != undefined) {
            popup.parentScene = parent;
        }
        if(action != undefined) {
            popup.action = action;
        }
        if(name != undefined) {
            popup.setName(name);
        }
        popup.setLocalZOrder(10);
        popup.x = 0;
        popup.y = 0;
        this.node.addChild(popup);
        return popup;
    },

    checkRateConfig: function () {
        if(Utils.checkNeedRateApp()) {
            return;
        }
        API.getApi('api/index/rate-number', function (str) {
            cc.log('str: ' + str);
            var json = JSON.parse(str);
            if(json.rate == 1) {
                cc.sys.localStorage.setItem('vkids_need_rate_app', 1);
                this.reloadAllCard();
            } else {
                cc.sys.localStorage.removeItem('vkids_need_rate_app')
            }

            if(json.china == 1) {
                cc.sys.localStorage.setItem('taukhau', 1);
            }

        }.bind(this));
    },

    actionSetting: function () {
        Utils.soundButton();
        this.addPrefabs(this.setting, "setting", undefined, this);
    },
    switchLearn: function () {
        Utils.soundButton();
        var level = Utils.getRangeNumber();
        var imgPath = "";
        if(level == 10) {
            level = 5;
            imgPath = "Texture/IMGUI/btn_1to5.png";
        } else {
            level = 10;
            imgPath = "Texture/IMGUI/btn_1to10.png";
        }
        cc.sys.localStorage.setItem("learnLevel", level);
        Utils.setSpriteFrame(this.learnLevel, imgPath, undefined, true);
    },
    learnAction: function () {
        Utils.soundButton();
        cc.director.loadScene("LearnSC.fire");
    },
    gameAction: function () {
        Utils.soundButton();
    },
    practicalAction: function () {
        Utils.soundButton();
        cc.director.loadScene("Practicle.fire");
    }


});
