/**
 * Created by anhmantk on 4/6/17.
 */
cc.Class({
    extends: cc.Component,

    onDestroy: function () {
        cc.sys.garbageCollect();
    }
});