/**
 * Created by anhmantk on 4/2/17.
 */
var GameData = {
    jsonData: null,
    arrayScene: [],
    gameIndex: 0,
    playGameLetter: 'a',
    gameCard: {
        cardIndex: 0,
        cardData: {}
    },
    restartGameData: function () {
        this.jsonData = null;
        this.arrayScene = [];
        this.gameIndex = 0;
        this.gameCard = {
            cardIndex: 0,
            cardData: {}
        };
    },
    nextGame: function () {
        if (typeof (this.arrayScene)=="undefined"){
            return;
        }
        var nextScName = "";
        if(this.arrayScene.length<=this.gameIndex){
            nextScName = "Scene/LearningScene/LearnSC";
        } else {
            nextScName=this.arrayScene[this.gameIndex];
        }
        this.gameIndex++;
        cc.log('nextScName: ' + nextScName);
        if(nextScName.length > 0) {
            cc.director.loadScene(nextScName);
        }
    }
}
module.exports = GameData;