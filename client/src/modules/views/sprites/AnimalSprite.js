var AnimalSprite = cc.Sprite.extend({
	lx: 0,
	ly: 0,
	id: null,

	ctor: function(resAniId) {
		this._super();
		this._sprite = fr.createAnimationById(resAniId);
		this.addChild(this._sprite);
	},

	onEnter: function() {
		this._super();
		this.setLogicPosition(this.lx, this.ly);
	},

	play: function(name, callback) {
		this._sprite.gotoAndPlay(name);
		this._sprite.setCompleteListener(callback);
	},

	setLogicPosition: function(x, y) {
		if (x.x) {
			y = x.y;
			x = x.x
		}
		this.lx = x;
		this.ly = y;
		var parent = this.getParent();
		if (!parent) {
			return;
		}
		var p = MapValues.logicToPosition(x, y);
		this.setLocalZOrder(10 * (x + y));
		this.setPosition(
			p.x + this.getParent().getContentSize().width / 2,
			p.y + this.getParent().getContentSize().height
		);
	},

	setId: function(id) {
		this.id = id;
	}
});
