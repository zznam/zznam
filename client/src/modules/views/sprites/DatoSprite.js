var DatoSprite = AnimationSprite.extend({
	natureId: 0,

	ctor: function(x, y, id) {
		this._super(resAniId.Dato, 
			MapConfigs.BigNatureThing.size.width,
			MapConfigs.BigNatureThing.size.height, 
			x, y, MapItemEnum.NATURE_THING);
		this.natureId = id;
		this.play("forest_big_stone_1_idle");
		this.registerTouchEvents();
	},

	onClick: function() {
		this.play("forest_big_stone_1_select");
		cc.log("DatoSprite is clicked", "lx:", this.lx, "ly:", this.ly, "id:", this.natureId);
	},

	_offset: function() {
		return cc.p(0, - MapValues.jLength + 20);
	}
});
