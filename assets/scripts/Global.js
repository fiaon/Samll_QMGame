window.Global = {
    ios: 1,
    appid:"wx039e71b55cba9869",
    Introuid:0,
    sessionId:null,
    is_end:false,
    is_Again:false,
    enemynumber:35,     //机器人数量
    dienumber:0,        //死亡数
    name:null,          //昵称
    sex:null,           //性别
    avatarUrl:null,     //头像url
    gold:0,             //金币
    diamond:0,          //钻石
    userlvl:null,       //段位
    score:null,         //积分
    SeaonLvl:null,      //段位信息
    duntext:null,       //当前段位信息
    userkey:null,       //玩家ID
    is_sign:false,      //今天是否签到
    hp:1600,            //血量
    attack:600,         //攻击力
    heroLv:1,           //等级
    startTime:null,     //纪录游戏页面的开始时间
    endHaveBox:false,   //结束是否出现宝箱
    boxChest:null,      //宝箱信息
    Crit:0,             //暴击率
    map_obj:new Map(),  //纪录游戏内分数排名


    prefab_tip: null,            //错误提示
    prefab_guanggao: null,

    shareimg: null,
    banner: null,

    jumpappObject: null,
    GuangGaoIndex: 0,                           //试玩广告index（需要切换界面就切换的）
    Zcount: 0,                       //转盘次数
    whetherShowSign: true,             //是否显示签到界面
    onAddSignCount: 0,
    whetherShowLucky: true,             //是否显示抽奖界面
    onAddLuckyCount: 0,
    whetherShowFriend: true,             //是否显示邀请好友界面
    onAddFriendCount: 0,
    PrizeListData: [],           //奖品列表
    showGameLoop:false,

    jumpinfo_callback: null,
    TheGameLoop: null,                          //游戏圈

    linkUrl:"https://wx.zaohegame.com/",
    //linkUrl:"http://wx.zaohegame.com:8099/",//测试地址
    url_UserLogin: "game/UserLogin",
    url_UserAuth: "game/UserAuth",

    //获取广告下表
    GetGuangGaoIndex() {
        if (this.jumpappObject) {
            if (this.GuangGaoIndex >= this.jumpappObject.length) {
                this.GuangGaoIndex = 0;
            } else {
                this.GuangGaoIndex++;
            }
        }
        return this.GuangGaoIndex;
    },
    UserLogin(parme){
        let self = this;
        this.Post(self.url_UserLogin,parme,(res)=>{
            self.sessionId = res.result.sessionid;
            Global.ShouQuan();
        });
    },
    Post(url,parme,callback){
        var self = this;
        if (CC_WECHATGAME) {
            wx.request({
                url:self.linkUrl+url,
                method:'post',
                data:parme,
                header:{
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success(res){
                    if(callback){
                        callback(res.data);
                    }
                    console.log("请求成功 "+url,res.data);
                },
                failed(res){
                    console.log("请求失败 "+url,res.data);
                },
                complete(res){
                    
                },
            });
        }else {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        var response = xhr.responseText;
                        if (response) {
                            var responseJson = JSON.parse(response);
                            callback(responseJson);
                        } else {
                            console.log("返回数据不存在")
                            callback(null);
                        }
                    } else {
                        console.log("请求失败")
                        callback(null);
                    }
                }
            };
            xhr.open("POST", url, true);
            xhr.send();
        }
    },
    //获取玩家信息
    GetUesrInfo(id){
        let parme = {
            sessionId:this.sessionId,
            fromuid:id,
        }
        this.Post("Qmeng/getuserinfo",parme,(res)=>{
            this.gold = res.result.gold;
            this.diamond= res.result.diamonds;
            this.userlvl = res.result.userlvl;
            this.score = res.result.score;
            this.userkey = res.result.userkey;
            this.Zcount = res.result.zpcount;
            if(res.result.chest.givevalue){
                this.boxChest = res.result.chest;
            }else{
                console.log("宝箱不存在: ");
            }
            Global.GetSeaonLvl((res)=>{
                Global.SeaonLvl = res.result.list;
                cc.director.loadScene("GameStart.fire");
            });
        });
    },
    //刷新玩家信息
    RefreshUesrInfo(callback){
        let parme = {
            sessionId:this.sessionId
        }
        this.Post("Qmeng/getuserinfo",parme,callback);
    },
    //获取段位信息
    GetSeaonLvl(callback){
        this.Post("Qmeng/GetSeaonLvl",null,callback);
    },
    //获取玩家身上的英雄信息
    GetUserHeros(callback){
        let parme = {
            sessionId:this.sessionId
        }
        this.Post("Qmeng/GetUserHeros",parme,callback);
    },
    //获取玩家赛季信息
    GetUserSeaon(callback){
        let parme = {
            sessionId:this.sessionId
        }
        this.Post("Qmeng/GetUserSeaon",parme,callback);
    },
    //数值变化请求
    UserChange(type,app,remark,change,callback){
        let data = {
            sessionId:this.sessionId,
            type:type,     //1：钻石 2：金币 3：积分
            app:app,      //1：系统 2：兑换 3：充值
            remark:remark,  //说明
            change :change,  //数量
        }
        this.Post("Qmeng/UserChange",data,callback);
    },
    //购买技能，升级技能
    BuySkill(heroid,skill,callback){
        let data = {
            sessionId:this.sessionId,
            hid:heroid,
            skill:skill,
        }
        this.Post("Qmeng/BuySkill",data,callback);
    },
    
    //获取签到信息
    GetUserSignInfo(callback){
        let data = {
            sessionId:this.sessionId,
            appid:this.appid,
        }
        this.Post("Qmeng/GetSginInfo",data,callback);
    },
    //签到
    UserSign(type,callback){
        let data = {
            sessionId:this.sessionId,
            appid:this.appid,
            type:type,
        }
        this.Post("Qmeng/UserSign",data,callback);
    },
    //转盘抽奖结果
    RunZhuanPan(callback){
        let data = {
            sessionId:this.sessionId,
            appid:this.appid,
        }
        this.Post("game/RunZhuanPan",data,callback);
    },
    //获取转盘获奖信息
    GetZhuanPanLog(){
        let data = {
            sessionId:this.sessionId,
            appid:this.appid,
        }
        this.Post("game/GetZhuanPanLog",data,(res)=>{
            this.PrizeListData = res.result;
        });
    },
    //修改转盘次数信息
    UpdateZP(){
        let data = {
            sessionId:this.sessionId,
        }
        this.Post("Qmeng/UpdateZP",data);
    },
    //开宝箱
    OpenChest(isvideo,callback){
        let data ={
            sessionId:this.sessionId,
            isvideo:isvideo,
        }
        this.Post("Qmeng/OpenChest",data,callback);
    },
    //获取邀请任务
    GetIntiveMission(callback){
        let data = {
            sessionId:this.sessionId,
        }
        this.Post("Qmeng/GetIntiveMission",data,callback);
    },
    
    //游戏结算
    GameSettle(kill,rank,callback){
        let data = {
            sessionId:this.sessionId,
            kill:kill,
            rank:rank,
        }
        this.Post("Qmeng/GameSettle",data,callback);
    },
    //升级技能
    BuyHerosLvl(isvideo,callback){
        let data = {
            sessionId:this.sessionId,
            isvideo:isvideo,
        }
        this.Post("QMeng/BuyHerosLvl",data,callback);
    },
    //获取机器人名字
    GetName(num,callback){
        let data = {
            sessionId:this.sessionId,
            num:num,
        }
        this.Post("game/getnicks",data,callback);
    },
    /**
     * 添加提示语
     * @param {*} node 
     * @param {*} msg 
     */
    ShowTip(node, msg) {
        let tip = cc.instantiate(this.prefab_tip);
        // 上线前注释console.log("tip == ", tip);
        if (tip) {
            if (node.getChildByName("tips")) {

            } else {
                node.addChild(tip);
                let src = tip.getComponent(require("TipShow"));
                if (src) {
                    src.label.string = msg;
                }
            }
        }
    },
    /**
     * 光效旋转方法
     */
    LightRotate: function () {
        var lightRotate = cc.repeatForever(
            cc.rotateBy(5, 360),
        )
        return lightRotate;
    },
    //登陆
    Login(){
        if (CC_WECHATGAME) {
            wx.login({
                success(res) {
                    console.log("登录成功 == ", res);
                    //window.self.code = res.code;
                    let parme = {
                        appid: Global.appid,
                        code: res.code,
                        introuid: Global.Introuid,
                    };
                    // Global.Post(url, parme);
                    Global.UserLogin(parme);
                }
            });
        }
    },
    ShouQuan(){
        if (CC_WECHATGAME) {
            let exportJson = {};
            let sysInfo = wx.getSystemInfoSync();
            //获取微信界面大小
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            window.wx.getSetting({
                success (res) {
                    console.log(res.authSetting);
                    if (res.authSetting["scope.userInfo"]) {
                        console.log("用户已授权");
                        window.wx.getUserInfo({
                            success(res){
                                console.log(res);
                                Global.UserAuthPost(res, Global.sessionId, () => {});
                                exportJson.userInfo = res.userInfo;
                                //此时可进行登录操作
                                Global.name = res.userInfo.nickName; //用户昵称
                                Global.avatarUrl = res.userInfo.avatarUrl; //用户头像图片 url
                                Global.sex = res.userInfo.gender;   //用户性别
                            }
                        });
                    }else {
                        console.log("用户未授权");
                        let button = window.wx.createUserInfoButton({
                            type: 'text',
                            text: '',
                            style: {
                                left: 0,
                                top: 0,
                                width: width,
                                height: height,
                                backgroundColor: '#00000000',//最后两位为透明度
                                color: '#ffffff',
                                fontSize: 20,
                                textAlign: "center",
                                lineHeight: height,
                            }
                        });
                        button.onTap((res) => {
                            if (res.userInfo) {
                                console.log("用户授权:", res);
                                Global.UserAuthPost(res, Global.sessionId, () => {});
                                exportJson.userInfo = res.userInfo;
                                //此时可进行登录操作
                                Global.name = res.userInfo.nickName; //用户昵称
                                Global.avatarUrl = res.userInfo.avatarUrl; //用户头像图片 url
                                Global.sex = res.userInfo.gender;   //用户性别
                                button.destroy();
                                let LaunchData_json = wx.getLaunchOptionsSync();
                                let queryValue = LaunchData_json.query;
                                if (queryValue) {
                                    if (LaunchData_json['query']['introuid']) {
                                        Global.GetUesrInfo(LaunchData_json['query']['introuid']);
                                        // 阿拉丁埋点
                                        wx.aldSendEvent('邀请',{'是否有效' : '是'});
                                    }else{
                                        Global.GetUesrInfo();
                                    }
                                }else{
                                     Global.GetUesrInfo();
                                }
                            }else {
                                console.log("用户拒绝授权:", res);
                            }
                        });
                    }
                }
            })
        }
    },
    /**
     * 授权接口
     * @param {*} res 参数
     * @param {*} sessionId sessionId
     */
    UserAuthPost(res, sessionId, callback) {
        this.sessionId = sessionId;
        this.rawData = res.rawData;
        this.compareSignature = res.signature;
        this.encryptedData = res.encryptedData;
        this.iv = res.iv;
        let parme = {
            appid: this.appid,
            sessionId: this.sessionId,
            rawData: this.rawData,
            compareSignature: this.compareSignature,
            encryptedData: this.encryptedData,
            iv: this.iv,
        };
        this.Post(this.url_UserAuth, parme, (res) => {
            if (res.resultcode == 500) {
                this.UserAuthPost(this.res, this.sessionId, callback);
                console.log("需要重新授权");
            }else{
                this.Introuid = res.result.uid;
            }
        });
    },
    TiaoZhanFriend() {
        if (CC_WECHATGAME) {
            console.log(this.shareimg);
            wx.shareAppMessage({
                title: '被这游戏分分钟虐的怀疑人生，我就问问：还有谁？',
                imageUrl: this.shareimg,
                success(res) {
                    console.log("yes");
                },
                fail(res) {
                    console.log("failed");
                },
            });
        }
    },

    ShowEndDlg() {
        let dlg = cc.instantiate(this.prefab_shibai);
        if (dlg) {
            let canvas = cc.find("Canvas");
            if (canvas) {
                dlg.parent = canvas;
            }
        }
    },

    Getinfo() {
        var self = this;
        this.Get("https://wx.zaohegame.com/game/shareimg?appid=wx039e71b55cba9869", (obj) => {
            if (obj.state == 1) {
                this.shareimg = obj.result;
            }
        });
    },

    GetJumpInfo(callback) {
        var self = this;
        this.Get("https://wx.zaohegame.com/game/jumpapp?appid=wx039e71b55cba9869", (obj) => {
            if (obj.state == 1) {
                this.jumpappObject = obj.result;
                var self = this;
                var count = 0;
                
                for (let i = 0; i < this.jumpappObject.length; i++) {
                    cc.loader.load({ url: this.jumpappObject[i].img, type: "png" }, function (err, res) {
                        self.jumpappObject[i].sprite = null;
                        if (err == null) {
                            let spriteFrame = new cc.SpriteFrame(res);
                            self.jumpappObject[i].sprite = spriteFrame;
                            count++;
                            if (count == self.jumpappObject.length) {
                                if (self.jumpinfo_callback) {
                                    self.jumpinfo_callback();
                                }
                            }
                        }
                        else {
                            console.log(i, err);
                        }
                    });
                    if(this.jumpappObject[i].img2 !=""){
                        cc.loader.load({ url: this.jumpappObject[i].img2, type: "jpg" }, function (err, res) {
                            self.jumpappObject[i].lunbo = null;
                            if (err == null) {
                                let spriteFrame = new cc.SpriteFrame(res);
                                self.jumpappObject[i].lunbo  = spriteFrame;
                                
                            }
                            else {
                                console.log(i, err);
                            }
                        });
                    }else{
                        self.jumpappObject[i].lunbo = null;
                    }
                }
            }
        });
    },

    Get(url, callback) {
        var self = this;
        if (CC_WECHATGAME) {
            wx.request({
                url: url,
                success: function (res) {
                    callback(res.data);
                    console.log(res.data);
                }
            });
        }
        else {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        var response = xhr.responseText;
                        if (response) {
                            var responseJson = JSON.parse(response);
                            callback(responseJson);
                        } else {
                            console.log("返回数据不存在")
                            callback(null);
                        }
                    } else {
                        console.log("请求失败")
                        callback(null);
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        }
    },

    showAdVedio(success, failed) {
        if (CC_WECHATGAME) {
            let videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-c307755960692bb5'
            })

            videoAd.load()
                .then(() => videoAd.show())
                .catch(err => console.log(err.errMsg));
            videoAd.offClose();
            videoAd.onClose(res => {

                if (res && res.isEnded || res === undefined) {
                    // self.UserInfo.AddGold(addvalue);
                    if (success)
                        success();
                }
                else {
                    if (failed)
                        failed();
                }
            });
            videoAd.onError(() => {
                console.log("失败处理");

            });
        }
    },

    showBannerTime: 0,
    showBanner: function () {
        if (this.banner == null) {
            if (CC_WECHATGAME) {
                let system = wx.getSystemInfoSync();
                if (system != null) {
                    this.ScreenWidth = system.windowWidth;
                    this.ScreenHeight = system.windowHeight;
                }

                if (system.system.search("iOS") != -1) {
                    this.ios = 1;
                    console.log("Ios");
                }
                else {
                    this.ios = -1;
                }
                let bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-0cab32f80e2ee1e0',
                    style: {
                        left: this.ScreenWidth/2-150,
                        top: this.ScreenHeight,
                        width: 300,
                    }
                })

                bannerAd.onResize(res => {
                    console.log(res.width, res.height);
                    console.log(bannerAd.style)

                    // if (bannerAd.style.realHeight > 120)
                    //     bannerAd.style.top = this.ScreenHeight - 120;
                    // else
                    //     bannerAd.style.top = this.ScreenHeight - bannerAd.style.realHeight;
                })
                this.banner = bannerAd;
                bannerAd.show()
                var self = this;
                bannerAd.onError(() => {
                    self.banner.hide();
                });

            }
            return;
        }

        this.showBannerTime++;
        if (this.showBannerTime >= 3) {
            if (CC_WECHATGAME) {

                let system = wx.getSystemInfoSync();
                if (system != null) {
                    this.ScreenWidth = system.windowWidth;
                    this.ScreenHeight = system.windowHeight;
                }


                this.showBannerTime = 0;
                this.banner.destroy();
                let bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-0cab32f80e2ee1e0',
                    style: {
                        left: this.ScreenWidth/2-150,
                        top: this.ScreenHeight,
                        width: 300,

                    }
                })

                bannerAd.onResize(res => {
                    console.log(res.width, res.height);
                    
                    // if (bannerAd.style.realHeight > 120)
                    //     bannerAd.style.top = this.ScreenHeight - 120;
                    // else
                    //     bannerAd.style.top = this.ScreenHeight - bannerAd.style.realHeight;
                })

                bannerAd.show();
                this.banner = bannerAd;
                var self = this;
                bannerAd.onError(() => {
                    self.banner.hide();
                });

            }
        }
        else {
            this.banner.show();
        }
    },
}