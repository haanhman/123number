cc.Class({
    extends: cc.Component,

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




    },

    addResourcePath:function(str_path){
        var source_exits=false;
        for(var is=0;is<this.arrRS.length;is++){
            if(this.arrRS[is]==str_path){
                source_exits=true;
                break;
            }
        }
        if(!source_exits){
            this.arrRS[this.index_countRS]=str_path;
            this.index_countRS++;
        }

    },
    getRandomNumber:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getWordList:function(numberword){
        var listW=[];
        var allWord=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","Y","X","Z"];
        var lowercase=false;
        for(var iw=0;iw<numberword;iw++){
            var index_rd=this.getRandomNumber(0,allWord.length-1);
            var rdlate=allWord[index_rd];
            if(rdlate=="I"){
                lowercase=true;
            }
            listW[iw]=rdlate;
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
        cc.loader.loadRes(file_rs, function (err, prefab_file) {
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
                self.true_index=self.getRandomNumber(0,c_w);
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
            cc.log("----this.source_audio_path==null");
            this.source_audio_path="Sound/gametouch/t"+this.true_word;
            this.addResourcePath(this.source_audio_path);
        }

        cc.loader.loadRes(this.source_audio_path, function (err, audiofile) {
            if(!(err==null)){
                cc.log("----error load word  %s ",err);
            }

            cc.audioEngine.stopAll();
            cc.audioEngine.playEffect(audiofile);
        });


    },

    touchIndex:function(index_touch){
        if(index_touch==this.true_index){
            var arr_well=["awesome","fantastic","greatjob","perfect","super","thatsit","yes","youraregreat","youdidit"];
            var rd_index=this.getRandomNumber(0,arr_well.length-1);
            var source_path="Sound/gamevoice/"+arr_well[rd_index];
            this.addResourcePath(source_path);
            cc.loader.loadRes(source_path, function (err, audiofile) {
                if(!(err==null)){
                    cc.log("----error load word  %s = %s ",err,rd_index);
                }

                cc.audioEngine.stopAll();
                cc.audioEngine.playEffect(audiofile);
            });
            this.buttonsound.active=false;
            return true;
        }else{
            var source_path="Sound/gamevoice/error";
            this.addResourcePath(source_path);
            cc.loader.loadRes(source_path, function (err, audiofile) {
                if(!(err==null)){
                    cc.log("----error load word  %s ",err);
                }

                cc.audioEngine.stopAll();
                cc.audioEngine.playEffect(audiofile);
            });
            return false;
        }
    },

    actionClose:function(){
        cc.director.loadScene("Game_Touch.fire");
    },

    onDisable: function() {// bat buoc phai co de giai phong bo nho
        cc.log("---------onDisable");
        for(var ir=0;ir<this.index_countRS;ir++){
            cc.log("    ---release rs: %s ",this.arrRS[ir]);
            cc.loader.releaseRes(this.arrRS[ir]);
        }
        this.buttonsound=null;
        this.colorList=null;
        this.soundTouch=null;
    },

    onDestroy:function(){
        cc.log("---------onDestroy");

    },

});
