var ChickenSprite = AnimalSprite.extend({
	direction: null,
	lstAction: 0,
	entered: false,
	isHungry: false,

	ctor: function() {
		this._super(resAniId.Chicken_Fix);
		this.direction = cc.p(0, 0);
	},

	onEnter: function() {
		this._super();
		this.entered = true;
		var parent = this.getParent();
		if (parent.blockSizeX) {
			this.maxX = this.getParent().blockSizeX;
			this.maxY = this.getParent().blockSizeY;
			var lx = (Math.round(Math.random() * 100) % ((this.maxX - 1) * 10)) / 10 + 0.5;
			var ly = (Math.round(Math.random() * 100) % ((this.maxY - 1) * 10)) / 10 + 0.5;
			this.setLogicPosition(lx, ly);

			if (this.isHungry) {
				this.play(ChickenSprite.Hungry);
				return;
			}

			if (this.remainTime > 0) {
				// cc.log("Set scheduleOnce after", this.remainTime / 1000);
				this.scheduleOnce(this.harvest, this.remainTime / 1000);
				this.doAction();
				this.scheduleOnce(function() {
					this.schedule(this.doAction, 4.0);
				}.bind(this), Math.round(Math.random() * 100) % 40 / 10);
			} else {
				this.harvest();
			}
		}
	},

	doAction: function() {
		var value = Math.round(Math.random() * 10) % 
			(this.lstAction === 0 ? 2 : 3) + (this.lstAction === 0 ? 1 : 0);
		this.lstAction = value;
		this.unscheduleUpdate();
		switch (value) {
			case 0:
				return this.walk();
			case 1:
				return Math.random() > 0.5 ? this.play(ChickenSprite.Idle2) : this.play(ChickenSprite.Idle3);
			case 2:
				return Math.random() > 0.5 ? this.play(ChickenSprite.Idle1) : this.play(ChickenSprite.Idle4);
		}
	},

	walk: function() {
		if (!this.maxX) {
			this.maxX = this.getParent().blockSizeX;
			this.maxY = this.getParent().blockSizeY;
		}
		// cc.log("Walk");
		this.play(ChickenSprite.Walk);
		this.direction.x = 2 * (Math.random() - 0.5);
		this.direction.y = Math.sqrt(1 - Math.pow(this.direction.x, 2)) * (Math.random() > 0.5 ? 1 : -1);
		
		// this.direction = cc.p(-1, -1);

		// cc.log("Walk", this.id, this.direction);
		if (this.lx < 0.5 && this.direction.x < 0) {
			this.direction.x *= -1;
		}
		if (this.ly < 0.5 && this.direction.y < 0) {
			this.direction.y *= -1;
		}
		if (this.lx > (this.maxX - 0.7) && this.direction.x > 0) {
			this.direction.x *= -1;
		}
		if (this.ly > (this.maxY - 0.7) && this.direction.y > 0) {
			this.direction.y *= -1;
		}
		// cc.log("Direction", this.direction);
		var p = MapValues.logicToPosition(this.direction.x, this.direction.y);
		if (p.x < 0) {
			this.setScaleX(-1);
		} else {
			this.setScaleX(1);
		}
		this.scheduleUpdate();
	},

	harvest: function() {
		this.unscheduleUpdate();
		this.unschedule(this.doAction);
		this.unschedule(this.harvest);
		this.play(ChickenSprite.Harvest);
	},

	hungry: function() {
		// cc.log("Set hungry");
		this.isHungry = true; // firstTime only
		if (this.entered) {
			this.play(ChickenSprite.Hungry);
		}
	},

	feed: function() {
		this.doAction();
		this.schedule(this.doAction, 4.0);
	},

	update: function(dt) {
		// UpdateWalk
		// cc.log("Direction", this.id, this.direction);
		var newX = this.lx + 0.4 * dt * this.direction.x;
		var newY = this.ly + 0.4 * dt * this.direction.y;
		if (newX < 0.2 || newX > (this.maxX - 0.6)
			|| newY < 0.2 || newY > (this.maxY - 0.6)
		) {
			this.unscheduleUpdate();
			this.play(Math.random() > 0.5 ? ChickenSprite.Idle1 : ChickenSprite.Idle2);
			return;
		}
		this.setLogicPosition(newX, newY);
	},

	setOnHarvestTime: function(time) {
		// cc.log("Harvest after", time);
		this._setOnHarvestTime(time, AnimalConfig.chicken.time * 1000);
	},

	demo: function() {
		this.play(ChickenSprite.Idle1);
	}
});

ChickenSprite.Idle1 = 'Chicken_Idle1';
ChickenSprite.Idle2 = 'Chicken_Idle2';
ChickenSprite.Idle3 = 'Chicken_Idle3';
ChickenSprite.Idle4 = 'Chicken_Idle4';
// ChickenSprite.Transition = 'Chicken_Transition';
ChickenSprite.Hungry = 'Chicken_Hungry';
ChickenSprite.Harvest = 'Chicken_Harvest';
ChickenSprite.Walk = 'Chicken_walk';
