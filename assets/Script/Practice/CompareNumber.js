var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        label: cc.Label
    },

    setText: function (number, color, isT) {
        this.isTrue = isT;
        this.label.string = number + "";
        this.label.node.color = color;
    },

    clickAction: function () {
        if (this.isTrue) {
            this.node.parent.getComponent("PracticleCompare").chooseNumberOk();
        } else {
            this.node.parent.getComponent("PracticleCompare").chooseNumberFail();
        }

    }
});
