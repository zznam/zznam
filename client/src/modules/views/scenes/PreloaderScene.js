/**
 * Created by CPU60135_LOCAL on 10/27/2017.
 */
var PreloaderLayer = BaseScene.extend({
    percent: 0,
    loadingBar: null,
    ctor : function(){
        // call super class's ctor fuction
        this._super();
        var size = cc.director.getVisibleSize();
        cc.log(size.width+" "  + size.height);
        //3. calculate the center point
        var centerpos = cc.p(size.width / 2, size.height / 2);
        this.center_bottom_pos = cc.p(size.width / 2, 40);

        // create a background image and set it's position at the center of the screensize

        var spritebg = new cc.Sprite(res.PRELOADER_CHRISTMAS_PNG);
        cc.log(spritebg.width+" "  +spritebg.height);
        spritebg.setScale(size.width/spritebg.width,size.height/spritebg.height);
        //spritebg.setScale(fr.clientConfig.getResourceScale().)
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);




        this.loadingBarFrame = new cc.Sprite(res.EXP_111_PNG);
        this.loadingBarFrame.setPosition(this.center_bottom_pos);
        this.addChild(this.loadingBarFrame);

        this.loadingBar = new ccui.LoadingBar();
        this.loadingBar.setName("PreloadingBar");
        this.loadingBar.loadTexture(res.EXP_221_PNG);
        this.loadingBar.setPercent(0);
        this.loadingBar.setPosition(this.center_bottom_pos);
        this.addChild(this.loadingBar);


    },

    onEnter:function(){
        this._super();
        this.scheduling = true;
        this.scheduleUpdate();
        this.onPlay();
    },
    
    onPlay : function(){
        // cc.log("==onplay clicked");
        if (cc.sys.localStorage.getItem("session")) {
            // cc.log("session exists");
            gv.gameClient.connect();
        } else {
            this.scheduling = false;
            // cc.log("session not exists");
            LoginScene.instance = new LoginScene();
            cc.director.runScene(LoginScene.instance);
        }
    },

    update:function(dt){
        this.percent += 100 * dt;
        // cc.log(this.percent);
        if (this.percent >= 100){
            this.unscheduleUpdate();
        }
        this.loadingBar.setPercent(this.percent);
    },

    showLoadingText: function() {
        if (this.scheduling) {
            this.unscheduleUpdate();
        }
        this.loadingBar.removeFromParent();
        this.loadingBarFrame.removeFromParent();
        var loadingLabel = new cc.LabelBMFont(fr.Localization.text("text_loading"), res.FONT_OUTLINE_50);
        loadingLabel.setPosition(this.center_bottom_pos);
        this.addChild(loadingLabel);
    }
});

var PreloaderScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        this.layer = new PreloaderLayer();
        this.addChild(this.layer);
    },

    showLoadingText: function() {
        this.layer.showLoadingText();
    },

    disconnected: function() {
        LoadingScene.instance = new LoadingScene();
        LoadingScene.instance.setText(fr.Localization.text("text_disconnect"));
        cc.director.runScene(LoadingScene.instance);
    },

    connectFailed: function() {
        LoadingScene.instance = new LoadingScene();
        LoadingScene.instance.setText(fr.Localization.text("text_disconnect"));
        cc.director.runScene(LoadingScene.instance);
    }
});
