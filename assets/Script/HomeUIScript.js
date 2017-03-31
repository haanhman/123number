var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

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
        parental: cc.Prefab,
        markLock:cc.Prefab,
        rqdownload:cc.Prefab,
        contentNode:cc.Node,

    },

    configDisplay:function(){
        //var sizesc=cc.director.getVisibleSize();
        //if(sizesc.height>800){
        //    this.bgDisplay.scaleY=sizesc.height/800;
        //    cc.log("---------size: %s %s %s",JSON.stringify(sizesc),sizesc.width,sizesc.height);
        //}
    },
    // use this for initialization

    reloadAllCard:function(){
        var limitFree = Utils.limitFree();
        var limitRateToUnlock = Utils.limitRateToUnlock();

        var allPage=this.contentNode.children;
        for(var pid in allPage){
            var page_node=allPage[pid];
            var cards=page_node.children;
            for(var ic in cards){
                var tmp_card=cards[ic];
                //xoa tat ca nhung phan tu con truoc khi kiem tra luat mua ban
                tmp_card.removeAllChildren(true);
                var letter = tmp_card.name.toLowerCase();

                if(limitFree.indexOf(letter) >= 0) {
                    tmp_card.removeAllChildren(true);
                } else if(limitRateToUnlock.indexOf(letter) >= 0) {
                    /*
                    * Kiểm tra đã rate app hay chua
                    * - nếu rate rồi
                    *   + đã download hay chua
                    * - nếu chưa rate, khi ấn vào card popup sẽ phải hiển thị nut rate app
                    * */
                    if(!Utils.checkRateApp() || !Utils.checkDownload(letter)) {
                        var rdl=cc.instantiate(this.rqdownload);
                        tmp_card.addChild(rdl);
                    }
                } else {
                    // neu chua mua thi hien thi mark lock
                    // mua roi ma chua down thi hien thi icon download
                    // download roi thi cho choi luon
                    if(!Utils.isUnlockContent()) {
                        var rdl=cc.instantiate(this.markLock);
                        tmp_card.addChild(rdl);
                    } else {
                        if(Utils.checkDownload(letter)) {
                            tmp_card.removeAllChildren(true);
                        } else {
                            var rdl=cc.instantiate(this.rqdownload);
                            tmp_card.addChild(rdl);
                        }
                    }

                }
            }
        }
    },

    onLoad: function () {
        this.configDisplay();
        if (Utils.isUnlockContent()) {
            this.removeBuyBtn();
        }
        this.reloadAllCard();
    },
    removeBuyBtn: function () {
        this.btnBuy.node.removeFromParent(true);
    },
    
    actionShare:function(){
        this.addParentalPopup('share');
    },
    actionRate:function(){
        this.addParentalPopup('rate');
    },
    actionAddMore:function(){
        this.addParentalPopup('ourapp');
    },
    actionSettings:function(){
        this.addParentalPopup('feedback');
    },
    actionBuyAll: function () {
        this.addParentalPopup('buy');
    },
    videoCompleteCallback: function () {
        this.activeBgNoTouch(false);
        cc.log("============= Play video complete =============");
    },
    closeVideoButton: function () {
        cc.log("============= Close video button =============");
        this.activeBgNoTouch(false);
    },
    actionClickCard: function (nodebutton) {
        var namebutton = nodebutton.target.name;
        namebutton = namebutton.toLocaleLowerCase();

        cc.log("---asd-as-d-sad-as:   %s", namebutton);
        var checkOldNode = this.node.getChildByName("PopOptions");
        if (checkOldNode == null) {
            var popnode = cc.instantiate(this.popOptionPrefab);
            popnode.name = "PopOptions"
            popnode.setLocalZOrder(10);
            popnode.x = 0;
            popnode.y = 0;
            this.node.addChild(popnode);


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
    },
    checkInstallData: function () {
        if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_ANDROID) {
            var checkFileExist = Utils.getFilePath("resources/video/a_song.mp4");
            cc.log("checkFileExist: %s", checkFileExist);
            if (!jsb.fileUtils.isFileExist(checkFileExist)) {
                var callFunc=cc.callFunc(this.copyDataFromZipFile,this);
                this.node.stopAllActions();
                this.node.runAction(cc.sequence(cc.delayTime(1.0),callFunc));
            }
        }
    },
    copyDataFromZipFile: function () {
        var installPopup = cc.instantiate(this.installData);
        installPopup.setName("InstallDataPopup");
        installPopup.setLocalZOrder(10);
        installPopup.x = 0;
        installPopup.y = 0;
        this.node.addChild(installPopup);

        var callFunc=cc.callFunc(function(){
            Utils.installCardData();
        },this);
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(1.0),callFunc));
    },
    removePopupInstallData: function () {
        cc.log("removePopupInstallData");
        this.node.getChildByName("InstallDataPopup").removeFromParent(true);
    },

    addParentalPopup: function (action) {
        Utils.parentAction = action;
        var parental = cc.instantiate(this.parental);
        parental.setName("parental");
        parental.setLocalZOrder(10);
        parental.x = 0;
        parental.y = 0;
        this.node.addChild(parental);
    },

});
