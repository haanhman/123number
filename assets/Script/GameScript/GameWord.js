cc.Class({
    extends: cc.Component,

    properties: {
        lbWordTouch:cc.Label,
        lbWordName:cc.Label,
        spSquare:cc.Node,
        spPic:cc.Sprite,
        colorRandom:{
            type:cc.Color,
            default:[]
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
