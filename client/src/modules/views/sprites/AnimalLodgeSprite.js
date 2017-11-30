var AnimalLodgeSprite = MapBlockSprite.extend({
	ctor: function(resGround, resFence, 
		offsetX, offsetY, fenceColumnWidth,
		blockSizeX, blockSizeY, lx, ly, mapItemType) {
		this._super(resGround, blockSizeX, blockSizeY, lx, ly, mapItemType);
		this.renderFence(resFence, offsetX, offsetY, fenceColumnWidth);
	},

	renderFence: function(resFence, offsetX, offsetY, fenceColumnWidth) {
		var groundSize = this.getContentSize();
		var fenceSprite = new cc.Sprite(resFence);
		var fenceSize = fenceSprite.getContentSize();

		// Render topleft fence
		var topLeftStartPoint = cc.p(
			groundSize.width / 2 - fenceSize.width / 2,
			groundSize.height
		);

		for (var i = 0; i < this.blockSizeY; i++) {
			fenceSprite = new cc.Sprite(resFence);
			fenceSprite.setPosition(
				topLeftStartPoint.x - i * (fenceSize.height - offsetX),
				topLeftStartPoint.y - i * (fenceSize.width / 2 - offsetY)
			);
			this.addChild(fenceSprite);
		}

		var topRightStartPoint = cc.p(
			topLeftStartPoint.x + fenceSize.width - fenceColumnWidth,
			topLeftStartPoint.y
		);

		for (var i = 0; i < this.blockSizeX; i++) {
			fenceSprite = new cc.Sprite(resFence);
			fenceSprite.setScaleX(-1);
			fenceSprite.setPosition(
				topRightStartPoint.x + i * (fenceSize.height - offsetX),
				topRightStartPoint.y - i * (fenceSize.width / 2 - offsetY)
			);
			this.addChild(fenceSprite);
		}

		var bottomLeftStartPoint = cc.p(
			topLeftStartPoint.x - (this.blockSizeY - 1) * (fenceSize.height - offsetX),
			topLeftStartPoint.y - this.blockSizeY * (fenceSize.width / 2 - offsetY)
		);

		for (var i = 0; i < this.blockSizeX; i++) {
			fenceSprite = new cc.Sprite(resFence);
			fenceSprite.setScaleX(-1);
			fenceSprite.setPosition(
				bottomLeftStartPoint.x + i * (fenceSize.height - offsetX),
				bottomLeftStartPoint.y - i * (fenceSize.width / 2 - offsetY)
			);
			
			this.addChild(fenceSprite);
		}

		var bottomRightStartPoint = cc.p(
			topRightStartPoint.x + (this.blockSizeX - 1) * (fenceSize.height - offsetX),
			topRightStartPoint.y - this.blockSizeX * (fenceSize.width / 2 - offsetY)
		);

		for (var i = 0; i < this.blockSizeY; i++) {
			fenceSprite = new cc.Sprite(resFence);
			fenceSprite.setPosition(
				bottomRightStartPoint.x - i * (fenceSize.height - offsetX),
				bottomRightStartPoint.y - i * (fenceSize.width / 2 - offsetY)
			);
			this.addChild(fenceSprite);
		}
	}
});
