// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        username:cc.Label,
        userImg:cc.Sprite,
        duantext:cc.Label,
        duanImg:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self = this;
        if (CC_WECHATGAME) {
            if(Global.is_Again){
                cc.find("Canvas/DOYouLikeView").active =true;
                Global.is_Again = false;
            }
            //微信的头像和名字
            var imgurl = Global.avatarUrl +"?aaa=aa.jpg";
            cc.loader.load({url:imgurl, type: 'jpg'},function(err, texture){
                if(texture){ 
                    var spriteFrame = new cc.SpriteFrame(texture);
                    self.userImg.spriteFrame = spriteFrame;
                }
            });
            self.username.string = Global.name;
            for(let i =0;i<Global.SeaonLvl.length;i++){
                if(Global.userlvl == Global.SeaonLvl[i].id){
                    Global.duntext = Global.SeaonLvl[i].name;
                    self.duantext.string = Global.duntext;
                    let url = Global.SeaonLvl[i].id+'.png';
                    cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                        self.duanImg.spriteFrame = spriteFrame;
                    });
                }
            }
           // 。。。的转发效果
            wx.showShareMenu();

            wx.onShareAppMessage(function (res) {
                return {
                    title: '是否敢来一战',
                    imageUrl: Global.shareimg,
                    success(res) {
                        console.log("yes");
                    },
                    fail(res) {
                        console.log("failed");
                    },
                };
            });
        }
    },
    onShowAppMsg(){
        Global.TiaoZhanFriend();
    }
    // update (dt) {},
});