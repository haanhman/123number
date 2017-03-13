cc.Class({
    extends: cc.Component,

    properties: {
        drawNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

/*ví dụ vẽ đường thẳng

        var ctx = this.drawNode.getComponent(cc.Graphics);
        ctx.moveTo(120,200);
        ctx.lineTo(20,20);

        ctx.moveTo(180,300);
        ctx.lineTo(70,20);
        ctx.stroke();
*/


        this.contentDraw=this.drawNode.getComponent(cc.Graphics);

        this.paths=[];

        this.enableRedraw=false;

        this.timereload=0.1;
        this.timeframe=0;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
        }, this.node);




    },


    onTouchBegan: function (touch, event) {
        var touchLoc = touch.getLocation();
        //touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);

        var tmp_path = [touchLoc];
        this.paths.push(tmp_path);

        this.enableRedraw=true;
        return true;
    },

    onTouchMoved: function (touch, event) {
        var touchLoc = touch.getLocation();
        //touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);
        this.enableRedraw=true;
        var count_path=this.paths.length;
        var tmp_path=this.paths[count_path-1];
        tmp_path.push(touchLoc);

    },

    onTouchEnded: function (touch, event) {
        this.enableRedraw=false;
    },

    redraw:function(){
        if(!this.enableRedraw){
            return;
        }
        this.contentDraw.clear();


        var max_paths=this.paths.length;
        if(max_paths<1){
            return;
        }
        for(var ip=0;ip<max_paths;ip++){
            var currentPath=this.paths[ip];
            var len=currentPath.length;
            if(len<2){
                cc.log("len: %s",len);
                continue;
            }
            this.contentDraw.moveTo(currentPath[0].x,currentPath[0].y);
            for(var cx=1;cx<len;cx++){
                var pos=currentPath[cx];
                this.contentDraw.lineTo(pos.x,pos.y);

            }
        }





        this.contentDraw.stroke();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.redraw();
    },

});
