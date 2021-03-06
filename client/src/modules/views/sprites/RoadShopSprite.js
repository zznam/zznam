var RoadShopSprite = MapBlockSprite.extend({
	ctor: function(x, y) {
		this._super(res.ROADSIDE_SHOP,
			MapConfigs.RoadShop.size.width,
			MapConfigs.RoadShop.size.height,
			x, y, MapItemEnum.ROAD_SHOP
		);
		this.registerTouchEvents({ lockMove: true, force: true });
	},

	onClick: function(lx, ly) {
		cc.log("Roadshop clicked", lx, ly);
		BaseGUILayer.instance.showMyShop();
	},

	onBeginClick: function() {
		// this.setOpacity(210);
		this.setColor(cc.color(200, 200, 200));
	},

	onEndClick: function() {
		// this.setOpacity(255);
		this.setColor(cc.color(255, 255, 255));
	}
});
