var ChickenLodgeSprite = AnimalLodgeSprite.extend({
	// chickenSpriteList: [],

	ctor: function(x, y) {
		this._super(
			res.CHICKEN_LODGE_GROUND, res.CHICKEN_LODGE_FENCE, 
			19, 9, 22,
			3, 3, x, y, MapItemEnum.LODGE);
	},

	setLogicPosition: function(lx, ly, notUpdatePriority) {
		this._super(lx, ly, notUpdatePriority);
		this.x += 33;
		this.y += -1;
	},

	// addChickenSprite: function(chickenSprite) {
	// 	this.chickenSpriteList.push(chickenSprite);
	// 	this.addChild(chickenSprite);
	// },

	onClick: function(lx, ly) {
		if (this.lodge.getAnimalCount() > 0) {
			var startTime = this.lodge.getLastFeededTime();
			var remain = AnimalConfig.chicken.time * 1000 - (new Date().getTime() - startTime);
			if (remain > 0) {
				// Animal feeded
				this.loadingBar = new LoadingBarLayout(
					AnimalConfig.chicken.time, startTime,
					// fr.Localization.text("Ga"), 1);
					"Ga", 1);
				var p = MapValues.logicToScreenPosition(this.lx, this.ly);
				this.loadingBar.setPosition(p.x, p.y + 50);
				BaseGUILayer.instance.addChild(this.loadingBar);
			}

			if (this.lodge.isHungry()) {
				// Show feed tools
				cc.log('Hungry');
			}

			if (this.lodge.canHarvest()) {
				cc.log("Harvest");
			}

			cc.log("HarvestableCount", this.lodge.harvestableCount());

		} else {
			// Open store to buy animal
			cc.log("Open store to buy animal");
		}

		// AnimalCtrl.instance.onMoveHarvestTool(lx, ly);
		// AnimalCtrl.instance.onMoveFeedTool(lx, ly);
	}
});
