var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        drawNodeContent:cc.Node,
        particleEffect:cc.Prefab,
        helpNode:{
            type:cc.Node,
            default:[]
        }
    },

    // use this for initialization
    onLoad: function () {
        this.scSize=cc.director.getVisibleSize();
        cc.log("---- %s    %s",this.scSize.width,this.scSize.height);
        this.size_screen=cc.p(568,320);
        this.index_trace=0;

        this.indexDraw=[];
        for(var ii=0;ii<10;ii++){
            this.indexDraw[ii]=0;
        }

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
        }, this.node);

        this.scriptDraw=this.drawNodeContent.getComponent("TraceGameDaw");

        this.createMask();

        this.loadHelp();

        //this.node.runAction(cc.sequence(cc.delayTime(9),cc.callFunc(this.loadHelp, this)));


    },

    onDisable: function onDisable() {
        this.scriptDraw=null;
    },

    actionReload:function(){
        this.index_trace=0;
        cc.log("-----actionReload:-----");
        this.indexDraw=[];
        for(var ii=0;ii<10;ii++){
            this.indexDraw[ii]=0;
        }

        var len_help=this.helpNode.length;
        for(var ih=0;ih<len_help;ih++){
            var tmp_help=this.helpNode[ih];
            var tmp_help_script=tmp_help.getComponent("TraceHelp");
            tmp_help_script.reloadHelp();
        }


        this.createMask();

        this.loadHelp();
    },

    loadHelp:function(){
        this.scriptDraw.loadNewPath();
        var len_help=this.helpNode.length;
        if(this.index_trace>=len_help){

            var handNode=this.node.getChildByName("bantay");
            handNode.stopAllActions();
            handNode.opacity=0;

            //finish
            var getLastOBJ=this.node.getChildByName("effectNode");

            if(getLastOBJ!=null){
                getLastOBJ.removeFromParent(true);
                cc.log("---removeFromParent");
                getLastOBJ=null;
            }
            getLastOBJ=cc.instantiate(this.particleEffect);
            getLastOBJ.x=0;
            this.node.addChild(getLastOBJ);
            this.blockLoad=false;
            this.scheduleOnce(this.loadNextScene,3);
        }else{
            var current_help=this.helpNode[this.index_trace];

            var current_help_script=current_help.getComponent("TraceHelp");
            current_help_script.loadHelp();


            for(var ih=0;ih<len_help;ih++){
                this.helpNode[ih].opacity=0;

            }
            current_help.opacity=255;
        }

    },

    loadNextScene:function(){
        //cc.log("-------asdlhaskjdksa load next+"+ Math.random());
        if(this.blockLoad){
            return;
        }
        this.blockLoad=true;
        if (typeof (Utils.arrScene)=="undefined"){
            return;
        }
        if(Utils.arrScene.length<=Utils.index_sc){
            return;
        }
        var nextScName=Utils.arrScene[Utils.index_sc];
        Utils.index_sc++;
        cc.director.loadScene(nextScName);

    },

    createMask:function(){
        var paths=[];
        var index_path=0;
        var len_help=this.helpNode.length;

        if(this.index_trace>=len_help){
            cc.log("-------error: len_help= %s",len_help);
        }else{

            for(var ih=0;ih<len_help;ih++){
                var helpNode=this.helpNode[ih];
                var listPos=[];
                var dots=helpNode.children;
                var len_dot=helpNode.childrenCount;
                if(len_dot<=2){
                    console.log("-----error len_dot= %s",len_dot);
                }
                for(var i_d=0;i_d<len_dot;i_d++){
                    var dot_node=dots[i_d];
                    listPos[i_d]=cc.p(dot_node.getPosition().x+this.size_screen.x,dot_node.getPosition().y+this.size_screen.y);
                }

                paths[index_path]=listPos;
                index_path++;
            }

        }
        this.scriptDraw.drawMask(paths);
    },




    onTouchBegan: function (touch, event) {
        var touchLoc = touch.getLocation();
        //touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);
        //cc.log("touchLoc: %s |  %s",touchLoc.x,touchLoc.y);
        //this.scriptDraw.sendonTouchBegan(touchLoc);



        this.activeDot(touchLoc);
        return true;
    },

    onTouchMoved: function (touch, event) {
        var touchLoc = touch.getLocation();
        touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);
        //this.scriptDraw.sendonTouchMoved(touchLoc);
        this.activeDot(touchLoc);
    },


    onTouchEnded: function (touch, event) {

        //this.scriptDraw.sendonTouchEnded();
        var count_p=this.helpNode.length;
        if(count_p<=this.index_trace){
            return;
        }

        var current_help_node=this.helpNode[this.index_trace];
        var count_dots=current_help_node.childrenCount;
        var current_index=this.indexDraw[this.index_trace];

        if(count_dots<=current_index){
            cc.log("--------- load next help");
            this.index_trace++;
            this.loadHelp();
        }
    },

    activeDot:function(poscheck){
        var count_p=this.helpNode.length;
        if(count_p<=this.index_trace){
            return;
        }

        poscheck=cc.p(poscheck.x-this.scSize.width/2,poscheck.y-this.scSize.height/2);
        var current_help_node=this.helpNode[this.index_trace];
        if(current_help_node.name=="onedot"){
            var count_dots=current_help_node.childrenCount;
            var alldot=current_help_node.children;
            for(var ipo=0;ipo<count_dots;ipo++){
                alldot[ipo].opacity=0;
            }
            var handNode=this.node.getChildByName("bantay");
            if(handNode.opacity>0){
                handNode.stopAllActions();
                handNode.opacity=0;
            }

            this.indexDraw[this.index_trace]=count_dots;
            this.scriptDraw.deActivePath(this.index_trace);
        }else{
            var count_dots=current_help_node.childrenCount;
            var current_index=this.indexDraw[this.index_trace];

            if(count_dots<=current_index){
                return;
            }

            var active_Dot=current_help_node.children[current_index];

            var distance=cc.pDistance(active_Dot.getPosition(),poscheck);

            if(distance<50){
                var handNode=this.node.getChildByName("bantay");
                if(handNode.opacity>0){
                    handNode.stopAllActions();
                    handNode.opacity=0;
                }


                active_Dot.isRemove=true;
                active_Dot.opacity=0;
                this.scriptDraw.deActiveDot(this.index_trace);
                this.indexDraw[this.index_trace]=current_index+1;
            }
        }



    },

});
