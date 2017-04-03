var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.disabletouch=false;
        this.node.opacity=0;
        this.node.runAction(cc.fadeTo(0.8,255));
    },
    onDisable: function() {// bat buoc phai co de giai phong bo nho
        cc.loader.releaseRes("PrefabGame/starboom");
        Utils.removeUnusedSpriteFrames();
    },


    startLoadGameConfig:function(){
        var allchild=this.node.children;
        var count_child=this.node.childrenCount;

        var count_word=this.arrWord.length;
        if(count_child!=count_word){
            return ;
        }

        var colorlist=[];
        for(var icc=0;icc<this.arrayColor.length;icc++){
            colorlist[icc]=this.arrayColor[icc].clone();
        }

        for(var ic=0;ic<count_child;ic++){
            var nodechild=allchild[ic];
            nodechild.name=""+ic;
            var lbchild=nodechild.getComponent(cc.Label);
            lbchild.string=this.arrWord[ic];

            var randomarray=this.getRandomInt(0,colorlist.length-1);
            nodechild.color=colorlist[randomarray];
            colorlist.splice(randomarray, 1);
        }
    },

    getRandomInt:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },


    actionShowEffect:function(number_index){
        for(var ac=0;ac<this.node.children.length;ac++){

            if(number_index==ac){

            }else{
                var tmp_node=this.node.children[ac];
                tmp_node.runAction(cc.fadeTo(0.5,0));
            }
        }


        var tmp_node=this.node.children[number_index];
        cc.loader.loadRes("PrefabGame/starboom", function (err, eff_file) {
            if(!(err==null)){
                cc.log("----error load word  %s ",err);
            }
            var tmp_eff=cc.instantiate(eff_file);
            tmp_node.addChild(tmp_eff);
            tmp_node.runAction(cc.moveTo(0.5,cc.p(0,0)));

        });
    },


    actionClickWord:function(nodebutton) {
        if(this.disabletouch){
            return;
        }
        var namebutton = nodebutton.target.name;
        namebutton = namebutton.toLocaleLowerCase();
        var parrentScript=this.node.parent.getComponent("GameTouchScript");
        var truecorrect=parrentScript.touchIndex(Number(namebutton));
        if(truecorrect){
            this.disabletouch=true;
            this.actionShowEffect(Number(namebutton));
        }
    }
});
