/**
 * Created by CPU60075_LOCAL on 19/11/2017.
 */

var GameShopController = cc.Class.extend({

    getMaxField: function () {
        var gameShop = new GameShop();
        return gameShop.getMaxField();
    }
});

// Moved to MainScene.js
// GameShopController.instance = new GameShopController();