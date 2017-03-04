"use strict";
cc._RFpush(module, 'cd1e4rdkaxIjKCfUg2QCvZH', 'HomeUIScript');
// Script/HomeUIScript.js

cc.Class({
    "extends": cc.Component,

    properties: {
        bgDisplay: {
            type: cc.Node,
            "default": null
        }
    },

    configDisplay: function configDisplay() {
        var sizesc = cc.director.getVisibleSize();
        if (sizesc.height > 800) {
            this.bgDisplay.scaleY = sizesc.height / 800;
            cc.log("---------size: %s %s %s", JSON.stringify(sizesc), sizesc.width, sizesc.height);
        }
    },
    // use this for initialization
    onLoad: function onLoad() {
        this.configDisplay();
    },

    actionShare: function actionShare() {},
    actionRate: function actionRate() {},
    actionAddMore: function actionAddMore() {},
    actionSettings: function actionSettings() {},
    actionBuyAll: function actionBuyAll() {}

});

cc._RFpop();