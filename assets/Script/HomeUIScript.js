var BridgeVideoPlayer = require('BridgeVideoPlayer');
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
        }

    },

    configDisplay:function(){
        var sizesc=cc.director.getVisibleSize();
        if(sizesc.height>800){
            this.bgDisplay.scaleY=sizesc.height/800;
            cc.log("---------size: %s %s %s",JSON.stringify(sizesc),sizesc.width,sizesc.height);
        }
    },
    // use this for initialization
    onLoad: function () {
        this.configDisplay();
    },


    actionShare:function(){
        
    },
    actionRate:function(){},
    actionAddMore:function(){
        BridgeVideoPlayer.playVideo("duck.mp4");
    },
    actionSettings:function(){
        BridgeVideoPlayer.playVideo("phonic.mp4");
    },
    actionBuyAll:function(){
        BridgeVideoPlayer.unlockData();
    },

    videoCompleteCallback: function () {
        cc.log("============= Play video complete =============");
    },
    closeVideoButton: function () {
        cc.log("============= Close video button =============");
    }


    actionClickCard:function(nodebutton){
        var namebutton=nodebutton.target.name;

        namebutton=namebutton.toLocaleLowerCase();

        cc.log("---asd-as-d-sad-as:   %s",namebutton);
        var checkOldNode=this.node.getChildByName("PopOptions");
        if(checkOldNode===null){
            var popnode=cc.instantiate(this.popOptionPrefab);
            popnode.name="PopOptions"
            popnode.setLocalZOrder(10);
            this.node.addChild(popnode);


            var scriptCard=popnode.getComponent("PopScript");
            scriptCard.cardSprite.spriteFrame=this.cardAtlas.getSpriteFrame("characters-"+namebutton);
            scriptCard.strCardName=namebutton;
            scriptCard.lbtitle.string="Letter "+namebutton.toUpperCase();
        }else{
            cc.log("lock add new popup");
        }







    },




});
