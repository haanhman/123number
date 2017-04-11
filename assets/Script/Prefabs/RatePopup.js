var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,
    
    closeAction: function() {
        this.node.removeFromParent(true);
    },
    
    rateAction: function() {
        this.node.parentScene.actionRate();
        this.node.removeFromParent(true);
    }
});
