var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
var API = require("Api");
cc.Class({
    extends: vkidsScene,

    properties: {
        popOptionPrefab: {
            type: cc.Prefab,
            default: null
        },

        cardAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        bgDisplay: {
            type: cc.Node,
            default: null
        },
        btnBuy: cc.Sprite,
        bgDisableTouch: cc.Sprite,
        installData: cc.Prefab,
        RatePopup: cc.Prefab,
        SalePopup: cc.Prefab,
        parental: cc.Prefab,
        markLock: cc.Prefab,
        rqdownload: cc.Prefab,
        contentNode: cc.Node,
        btnMoreApp: cc.Sprite
    },

    configDisplay: function () {
        //var sizesc=cc.director.getVisibleSize();
        //if(sizesc.height>800){
        //    this.bgDisplay.scaleY=sizesc.height/800;
        //}
    },
    // use this for initialization

    reloadAllCard: function () {
        var limitFree = null;
        var limitRateToUnlock = null;
        limitFree = Utils.limitFree();
        limitRateToUnlock = Utils.limitRateToUnlock();
        cc.log('limitFree: ' + limitFree.join(' - '));
        cc.log('limitRateToUnlock: ' + limitRateToUnlock.join(' - '));

        var allPage = this.contentNode.children;
        for (var pid in allPage) {
            var page_node = allPage[pid];
            var cards = page_node.children;
            for (var ic in cards) {
                var tmp_card = cards[ic];
                tmp_card.removeAllChildren(true);
                tmp_card.cardType = "free";
                //xoa tat ca nhung phan tu con truoc khi kiem tra luat mua ban
                tmp_card.removeAllChildren(true);
                var letter = tmp_card.name.toLowerCase();

                if (limitFree.indexOf(letter) >= 0) {
                    tmp_card.removeAllChildren(true);
                } else if (limitRateToUnlock.indexOf(letter) >= 0) {
                    /*
                     * Kiểm tra đã rate app hay chua
                     * - nếu rate rồi
                     *   + đã download hay chua
                     * - nếu chưa rate, khi ấn vào card popup sẽ phải hiển thị nut rate app
                     * */

                    if (!Utils.checkRateApp()) {
                        var rdl = cc.instantiate(this.rqdownload);
                        tmp_card.addChild(rdl);
                        tmp_card.cardType = "rate";
                    }
                } else {
                    // neu chua mua thi hien thi mark lock
                    // mua roi ma chua down thi hien thi icon download
                    // download roi thi cho choi luon
                    if (!Utils.isUnlockContent()) {
                        var rdl = cc.instantiate(this.markLock);
                        tmp_card.addChild(rdl);
                        tmp_card.cardType = "buy";
                    } else {
                        if (Utils.checkDownload(letter)) {
                            tmp_card.removeAllChildren(true);
                        } else {
                            var rdl = cc.instantiate(this.rqdownload);
                            tmp_card.addChild(rdl);
                        }
                    }

                }
            }
        }
    },

    onLoad: function () {
        if (cc.sys.os == cc.sys.OS_OSX) {
            cc.sys.localStorage.removeItem('vkids_buy_content');
            cc.sys.localStorage.removeItem('vkids_rated');
            cc.sys.localStorage.removeItem('vkids_need_rate_app')
        }

        cc.sys.localStorage.setItem('vkids_buy_content', true);
        cc.sys.localStorage.setItem('vkids_rated', true);
        cc.sys.localStorage.setItem('vkids_need_rate_app', true)

        this.checkRateConfig();

        this.configDisplay();
        if (Utils.isUnlockContent()) {
            this.btnMoreApp.node.active = true;
            this.btnMoreApp.node.opacity = 255;
            this.removeBuyBtn();
        }
        this.reloadAllCard();
    },
    removeBuyBtn: function () {
        this.btnBuy.node.removeFromParent(true);

        var sequence = [];
        sequence.push(cc.delayTime(1.0));
        sequence.push(cc.fadeIn(0.3));

        this.btnMoreApp.node.active = true;
        this.btnMoreApp.node.runAction(cc.sequence(sequence));
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
        this.addParentalPopup('buy', this);
    },
    actionBuyAll: function () {
        this.addPrefabs(this.SalePopup, "sale_popup", undefined, this);
        return;
    },
    actionClickCard: function (nodebutton) {
        if(nodebutton.target.cardType == 'rate') {
            this.addPrefabs(this.RatePopup, "rate_popup", undefined, this);
            return;
        }
        if(nodebutton.target.cardType == 'buy') {
            this.addPrefabs(this.SalePopup, "sale_popup", undefined, this);
            return;
        }
        var namebutton = nodebutton.target.name;
        namebutton = namebutton.toLocaleLowerCase();

        var checkOldNode = this.node.getChildByName("PopOptions");
        if (checkOldNode == null) {
            var popnode = this.addPrefabs(this.popOptionPrefab, "PopOptions");

            var scriptCard = popnode.getComponent("PopScript");
            scriptCard.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("characters-" + namebutton);
            scriptCard.strCardName = namebutton;
            scriptCard.lbtitle.string = "Letter " + namebutton.toUpperCase();
            scriptCard.selectedLetter = namebutton.toLowerCase();
            scriptCard.validateCardInfo();
        } else {
            cc.log("lock add new popup");
        }
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

    activeBgNoTouch: function (active) {
        this.bgDisableTouch.node.active = active;
        this.bgDisableTouch.node.setLocalZOrder(11);
    },

    bgClickAction: function () {
        cc.log("====> Bg click");
    },

    start: function () {
        this.checkInstallData();
        if(Utils.isUnlockContent() == null) {
            Utils.loadPackageInappPurchase();
        }
    },
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
        // if(Utils.checkNeedRateApp()) {
        //     return;
        // }
        API.getApi('api/index/rate', function (str) {
            cc.log('str: ' + str);
            var json = JSON.parse(str);
            if(json.rate == 1) {
                cc.sys.localStorage.setItem('vkids_need_rate_app', 1);
                this.reloadAllCard();
            } else {
                cc.sys.localStorage.removeItem('vkids_need_rate_app')
            }

            if(json.china == 0) {
                cc.sys.localStorage.setItem('taukhau', 1);
            }

        }.bind(this));
    }

});
