cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.isLoadHelp=false;

        var allchild=this.node.children;
        var count_child=this.node.childrenCount;
        if(count_child<2){
            return;
        }


        for(var ic=0;ic<count_child;ic++){
            var tmpd_dot=allchild[ic];
            tmpd_dot.isRemove=false;
            if(tmpd_dot.opacity<255){
                tmpd_dot.opacity=0;
                tmpd_dot.isHidden=true;
            }

        }

    },

    reloadHelp:function(){
        var allchild=this.node.children;
        var count_child=this.node.childrenCount;
        if(count_child<2){
            return;
        }
        for(var ic=0;ic<count_child;ic++){
            var tmpd_dot=allchild[ic];
            if(tmpd_dot.isHidden){
                tmpd_dot.opacity=0;
            }else{
                tmpd_dot.opacity=255;
            }

        }
        this.isLoadHelp=false;
    },

    loadHelp:function(){
        if(this.isLoadHelp){
            return;
        }
        this.isLoadHelp=true;
        var handNode=this.node.parent.getChildByName("bantay");
        handNode.opacity=0;
        handNode.stopAllActions();

        var allchild=this.node.children;
        var count_child=this.node.childrenCount;
        if(count_child<2){
            return;
        }
        var arrayAction=[];
        var lastPos=allchild[0].getPosition();
        arrayAction[0]=cc.fadeTo(0.5,255);
        handNode.setPosition(lastPos);

        var count_index=1;
        for(var ic=1;ic<count_child;ic++){
            var tmpd_dot=allchild[ic];
            var name_dot=tmpd_dot.name;


            if(name_dot==="dot_hidden_ignore"){
                cc.log("----tmpd_dot.name : %s",name_dot);
                continue;
            }
            arrayAction[count_index]=cc.moveTo(0.15,tmpd_dot.getPosition());
            count_index++;

        }
        arrayAction[count_index]=cc.fadeTo(0.3,0);
        arrayAction[count_index+1]=cc.moveTo(0.1,lastPos);
        arrayAction[count_index+2]=cc.delayTime(0.6);
        handNode.runAction(cc.repeatForever(cc.sequence(arrayAction)))
    },
});
