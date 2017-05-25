var Utils = require('Utils');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.totalObject = this.node.childrenCount;
        this.touchCount = 0;
    },
    
    clickObject: function (obj) {
        var img = obj.currentTarget.getComponent("PracticleCountObject");
        if(img.touchOk) {
            return;
        }
        this.touchCount++;
        img.touchOk = true;
        img.setLbl(this.touchCount);
        if(this.touchCount == this.totalObject) {
            this.node.parent.getComponent('PracticleCount').countDone();
        }
    },
    loadImg: function (name, color) {
        cc.log(color);
        var sprites = this.node.getComponentsInChildren(cc.Sprite);
        for(var i = 0; i < this.totalObject; i++) {
            var image = sprites[i];
            image.node.getComponentInChildren(cc.Label).node.color = color;
            Utils.setSpriteFrame(image, "Practicle/Count/IMG/" + name  + ".png");
        }
    }
});
