/**
 * Created by anhmantk on 3/3/17.
 */
var currentsc = cc.director.getScene();
var runningScene = currentsc.children[0].getComponent("VideoScene");
runningScene.videoCompleteCallback();
