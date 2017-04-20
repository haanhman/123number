var vkidsScene = require("VkidsScene");
var Utils = require("Utils");
cc.Class({
    extends: vkidsScene,
    properties: {
        oldPrice: cc.Label,
        newPrice: cc.Label,
        throughLine: cc.Sprite
    },

    onLoad: function() {
        this.oldPrice.string = Utils.getOldPrice();
        this.newPrice.string = Utils.getNewPrice();

        var throughLineScale = this.oldPrice.node.getContentSize().width / 29;
        this.throughLine.node.setScale(throughLineScale, 0.5);
    },
    
    closeAction: function() {
        this.node.removeFromParent(true);
    },
    
    buyAction: function() {
        this.node.parentScene.actionBuyNow();
        this.node.removeFromParent(true);
    },

    restoreAction: function() {
        this.node.parentScene.actionRestore();
        this.node.removeFromParent(true);
    }
});
