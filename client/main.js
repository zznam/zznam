/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

var gv = gv || {};

// Redefine cc.log
cc._log = cc.log;
cc.log = function() {
    var contents = [];
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'object') {
            contents.push(JSON.stringify(arguments[i], null, 2));
        } else {
            if (arguments[i] === undefined) {
                contents.push('undefined');
            } else {
                contents.push(arguments[i]);
            }
        }
    }
    cc._log(contents.join(' '));
}

var user = null;
var home = true;

// chooseServer: 
// 1: 127.0.0.1
// 2: 120.138.65.103 
var chooseServer = 2;

cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    cc.loader.resPath = "res";
    cc.LoaderScene.preload(g_resources, function () {
        //hide fps
        cc.director.setDisplayStats(true);
        fr.clientConfig.init();
        // Setup the resolution policy and design resolution size
        cc.view.setDesignResolutionSize(
                fr.clientConfig.getDesignResolutionSize().width,
                fr.clientConfig.getDesignResolutionSize().height,
                cc.ResolutionPolicy.SHOW_ALL);
        // The game will be resized when browser size change
        cc.view.resizeWithBrowserSize(true);
        //update config resource
        fr.clientConfig.detectResourceFromScreenSize();
        if(cc.sys.isNative) {
            cc.view.setContentScaleFactor(
                    fr.clientConfig.getResourceScale());
        }
        fr.clientConfig.updateResourceSearchPath();
        gv.gameClient = new GameClient();
        gv.poolObjects = new PoolObject();

        // user = new User();
        testnetwork.connector = new testnetwork.Connector(gv.gameClient);

		//cc.director.runScene(new MainScene());
        fr.Localization.getInstance().setCurrentLanguage('vi');

        SoundCtrl.instance = new SoundCtrl();
        SoundCtrl.instance.loadSetting();
        SoundCtrl.instance.playMusic(res.bg_luamoi_mp3, true);
        PreloaderScene.instance = new PreloaderScene();
        cc.director.runScene(PreloaderScene.instance);

        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() {
            cc.log("[Game] Hiden");
            cc.audioEngine.stopMusic(true);
        });

        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function() {
            cc.log("[Game] Show");
            SoundCtrl.instance.playMusic(res.bg_luamoi_mp3, true);
        });
    }, this);
};
cc.game.run();
