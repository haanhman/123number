var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,
    
    closeAction: function() {
        this.node.removeFromParent(true);
    },
    
    rateAction: function() {
        var parentScript = this.node.parent.getComponent('HomeUIScript');
        parentScript.actionRate();
        this.node.removeFromParent(true);
    }
});
