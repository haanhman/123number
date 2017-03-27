var BridgeInappPurchase = require('BridgeInappPurchase');
var BridgeDownload = require('BridgeDownload');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        popOptionPrefab:{
            type:cc.Prefab,
            default:null
        },

        cardAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        bgDisplay:{
            type:cc.Node,
            default: null
        },
        btnBuy: cc.Sprite,
        bgDisableTouch: cc.Sprite,
    },

    configDisplay:function(){
        //var sizesc=cc.director.getVisibleSize();
        //if(sizesc.height>800){
        //    this.bgDisplay.scaleY=sizesc.height/800;
        //    cc.log("---------size: %s %s %s",JSON.stringify(sizesc),sizesc.width,sizesc.height);
        //}
    },
    // use this for initialization
    onLoad: function () {
        this.configDisplay();
        var vkids_buy_content = cc.sys.localStorage.getItem('vkids_buy_content');
        if(vkids_buy_content) {
            this.removeBuyBtn();
        }
    },
    removeBuyBtn: function() {
        this.btnBuy.node.removeFromParent(true);  
    },

    actionShare:function(){
        BridgeDownload.startDownload('https://fir-e5fd4.firebaseapp.com/zip/b.zip');
    },
    actionRate:function(){

    },
    actionAddMore:function(){

    },
    actionSettings:function(){

    },
    actionBuyAll:function(){
        BridgeInappPurchase.unlockData();
    },

    videoCompleteCallback: function () {
        this.activeBgNoTouch(false);
        cc.log("============= Play video complete =============");
    },
    closeVideoButton: function () {
        cc.log("============= Close video button =============");
        this.activeBgNoTouch(false);
    },
    actionClickCard:function(nodebutton){
        var namebutton=nodebutton.target.name;
        namebutton=namebutton.toLocaleLowerCase();

        cc.log("---asd-as-d-sad-as:   %s",namebutton);
        var checkOldNode=this.node.getChildByName("PopOptions");
        if(checkOldNode==null){
            var popnode=cc.instantiate(this.popOptionPrefab);
            popnode.name="PopOptions"
            popnode.setLocalZOrder(10);
            popnode.x=0;
            popnode.y=0;
            this.node.addChild(popnode);


            var scriptCard=popnode.getComponent("PopScript");
            scriptCard.cardSprite.spriteFrame=this.cardAtlas.getSpriteFrame("characters-"+namebutton);
            scriptCard.strCardName=namebutton;
            scriptCard.lbtitle.string="Letter "+namebutton.toUpperCase();
            scriptCard.selectedLetter = namebutton.toLowerCase();
            scriptCard.validateCardInfo();
        }else{
            cc.log("lock add new popup");
        }
    },
    unlockDataSuccess: function() {
        cc.log("Nguoi dung da unlock data thanh cong");
        cc.sys.localStorage.setItem('vkids_buy_content', true);
        this.removeBuyBtn();
    },
    unlockDataError: function() {
        cc.log("Unlock data that bai");
    },

    activeBgNoTouch: function (active) {
        this.bgDisableTouch.node.active = active;
        this.bgDisableTouch.node.setLocalZOrder(11);
    },

    bgClickAction: function() {
        cc.log("====> Bg click");
    },
});
