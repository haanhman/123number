var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        nodeSLNumber:cc.Node,
        lbCount:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.nodeSLNumber.setLocalZOrder(-10);
        this.nodeSLNumber.active=false;
        if(Utils.rangeNumber=="undefined"){
            Utils.rangeNumber=5;
        }else if(Utils.rangeNumber==null){
            Utils.rangeNumber=5;
        }

    },

    actionClose:function(){

    },
    actionSlectNumber:function(){
        this.nodeSLNumber.active=!this.nodeSLNumber.active;
    },
    actionTracing:function(){

    },
    actionLearning:function(){
        cc.director.loadScene("Learn123.fire");
    },
    actionCounting:function(){
        cc.director.loadScene("LearnCounting.fire");
    },
    actionReading:function(){
        cc.director.loadScene("Reading.fire");
    },


    actionSelect15:function(){
        this.nodeSLNumber.active=false;
        this.lbCount.string="5";
        Utils.rangeNumber=5;
    },
    actionSelect110:function(){
        this.nodeSLNumber.active=false;
        this.lbCount.string="10";
        Utils.rangeNumber=10;
    },



});
