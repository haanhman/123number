var Utils = require('Utils');
var GameData = require('GameData');
var vkidsScene = require("VkidsScene");
cc.Class({
    extends: vkidsScene,

    properties: {
        soundTouch:cc.AudioClip,
        colorList:{
            type:cc.Color,
            default:[]
        },
        buttonsound:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.index_countRS=0;
        this.arrRS=[];
        this.loadGameRandom();
        this.isClosed=false;
    },

    addResourcePath:function(str_path){
        var path = Utils.getFilePath("resources/" + str_path);
        var source_exits=false;
        for(var is=0;is<this.arrRS.length;is++){
            if(this.arrRS[is]==path){
                source_exits=true;
                break;
            }
        }
        if(!source_exits){
            this.arrRS[this.index_countRS]=path;
            this.index_countRS++;
        }
    },
    getRandomNumber:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getWordList:function(numberword){
        var listW=[];
        var allWord=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","Y","X","Z"];

        var removeIndex = allWord.indexOf(GameData.playGameLetter.toUpperCase());
        allWord.splice(removeIndex,1);
        listW.push(GameData.playGameLetter.toUpperCase());
        if(GameData.playGameLetter.toUpperCase() == "I") {
            lowercase=true;
        }

        var lowercase=false;
        for(var iw=0;iw<numberword-1;iw++){
            var index_rd=this.getRandomNumber(0,allWord.length-1);
            var rdlate=allWord[index_rd];
            if(rdlate=="I"){
                lowercase=true;
            }
            listW.push(rdlate);
            allWord.splice(index_rd,1);
        }

        //listW=["B","D","E","G","S"];
        if((this.getRandomNumber(0,10)>5)||lowercase){
            var cc=listW.length;
            for(var iwx=0;iwx<cc;iwx++){
                var ww_tmp=listW[iwx];
                if(ww_tmp=="J"||ww_tmp=="L"){

                }else{
                    listW[iwx]=ww_tmp.toLowerCase();
                }

            }
        }
        return listW;
    },
    loadGameRandom:function(){
        var indexprefab=this.getRandomNumber(2,5);
        //indexprefab=5;
        var file_rs="PrefabGame/GameTouch"+indexprefab;
        this.addResourcePath(file_rs);

        var self=this;
        cc.loader.loadRes(file_rs,cc.Prefab, function (err, prefab_file) {
            if(!(err==null)){
                cc.log("----err===  %s ",err);
            }
            var node_tmp=cc.instantiate(prefab_file);
            self.node.addChild(node_tmp);
            var scriptNode_tmp=node_tmp.getComponent("GaemTouchChildScript");
            scriptNode_tmp.arrWord=self.getWordList(indexprefab);
            scriptNode_tmp.arrayColor=self.colorList;
            scriptNode_tmp.startLoadGameConfig();

            var c_w=indexprefab-1;
            if(c_w>=1){

                for(var index in scriptNode_tmp.arrWord) {
                    if(scriptNode_tmp.arrWord[index].toLowerCase() == GameData.playGameLetter.toLowerCase()) {
                        self.true_index=index;
                        break;
                    }
                }

                var strw=scriptNode_tmp.arrWord[self.true_index];
                self.true_word=strw.toLowerCase();
                self.source_audio_path==null
                self.playSoundTouch();
            }


        });
    },



    playSoundTouch:function(){
        if(this.buttonsound.opacity<100){
            return;
        }
        if(this.source_audio_path==null){
            this.source_audio_path="Sound/gametouch/t"+this.true_word + ".mp3";
            this.addResourcePath(this.source_audio_path);
        }
        Utils.playSoundSource(this.source_audio_path, false, true);
    },

    touchIndex:function(index_touch){
        if(index_touch==this.true_index){
            var arr_well=["awesome","fantastic","greatjob","perfect","super","thatsit","yes","youraregreat","youdidit"];
            var rd_index=this.getRandomNumber(0,arr_well.length-1);
            var source_path="Sound/gamevoice/"+arr_well[rd_index] + ".mp3";
            this.addResourcePath(source_path);
            Utils.playSoundSource(source_path, false, true);
            this.buttonsound.active=false;
            this.blockLoad=false;
            this.scheduleOnce(this.loadNextScene,3);
            return true;
        }else{
            var source_path="Sound/gamevoice/error.mp3";
            this.addResourcePath(source_path);
            Utils.playSoundSource(source_path, false, true);
            return false;
        }
    },

    actionClose:function(){
        if(this.isClosed){
            return;
        }
        this.isClosed=true;
        Utils.playSoundSource("Sound/gamevoice/Goodbye.mp3",false,true);
        cc.director.setClearColor(cc.Color.WHITE);
        this.node.runAction(cc.fadeTo(0.4,0));

        this.scheduleOnce(this.gotoHomePage,0.5);
    },
    gotoHomePage:function(){
        cc.director.loadScene("MainSC");
    },

    loadNextScene:function(){
        if(this.blockLoad){
            return;
        }
        this.blockLoad=true;
        GameData.nextGame();
    },

});
