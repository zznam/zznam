var MainScene = BaseScene.extend({
	ctor: function() {
		this._super();

		// Init controllers
		PlantCtrl.instance = new PlantCtrl();
		GameShopController.instance = new GameShopController();
		StorageCtrl.instance = new StorageCtrl();
		MachineController.instance = new MachineController();
		ConstructedCtrl.instance = new ConstructedCtrl();
		AnimalCtrl.instance = new AnimalCtrl();
		NatureCtrl.instance = new NatureCtrl();
		FriendCtrl.instance = new FriendCtrl();

		// Init layers
		MapLayer.instance = new MapLayer();
		this.addChild(MapLayer.instance);

		//
		PopupLayer.instance = new PopupLayer();
		this.addChild(PopupLayer.instance);


		TablePopupLayer.instance = new TablePopupLayer();
		this.addChild(TablePopupLayer.instance);

		MachineLayer.instance = new MachineLayer();
		this.addChild(MachineLayer.instance);

		//var mainGuiLayer = new MainGuiLayer();
		AnimateEventLayer.instance = new AnimateEventLayer();
		this.addChild(AnimateEventLayer.instance);

		//var mainGuiLayer = new MainG+uiLayer();
		//this.addChild(mainGuiLayer);
		//MainGuiLayer.instance = new MainGuiLayer();
		//this.addChild(MainGuiLayer.instance);

		MapCtrl.instance = new MapCtrl();

        OrderCtrl.instance = new OrderCtrl();
		MyShopCtrl.instance = new MyShopCtrl();

        // Add ScheduleLoop
        // ScheduleLoop.instance = new ScheduleLoop();
        this.addChild(ScheduleLoop.instance); // Instance created in ScheduleLoop.js
		cc.log("Start Scene");
	},

	onEnter: function() {
		this._super();
		this.init();
	},

	onGettedData: function() {
		cc.log("Welcome", user.id, user.name);
		MainGuiLayer.instance = new MainGuiLayer();
		this.addChild(MainGuiLayer.instance);

		BaseGUILayer.instance = new BaseGUILayer();
		this.addChild(BaseGUILayer.instance);

		MapCtrl.instance.init();
		MapCtrl.instance._showDebugMap();

		OrderBGLayer.instance = new OrderBGLayer();


		if (user.asset.countAnimalByType(AnimalType.chicken) > 0) {
			this.schedule(this.scheduleSoundChickenIdle01, 29);
			this.schedule(this.scheduleSoundChickenIdle02, 11);
		}
		if (user.asset.countAnimalByType(AnimalType.cow) > 0) {
			SoundCtrl.instance.playSoundEffect(res.ani_cow_idle_mp3, false);
			this.schedule(this.scheduleSoundCowIdle, 15);
		}
		// this.addChild(OrderBGLayer.instance);
		if (!home) {
			FriendHomeLayer.instance = new FriendHomeLayer();
			this.addChild(FriendHomeLayer.instance);
		}

        //BaseGUILayer.instance.notifyFullStorage(StorageTypes.FOOD_STORAGE);
		//BaseGUILayer.instance.notifyMissGold(50);

		//BaseGUILayer.instance.notifyFullStorage(StorageTypes.FOOD_STORAGE);
		//BaseGUILayer.instance.notifyMissGold(50);
		//cc.log(res.infoCoopItem[0]["id"]);

		//BaseGUILayer.instance.loadingBar();

        //var model = new Machine(0, "bakery_machine", 3, 0, null, false, getTime(), new Coordinate(20, 20));
        //user.asset.addMachine(model);
        ////cc.log("model " + model.coordinate.x + " " + model.coordinate.y + " id " + model.id + " slot " + model.slot);
        ////var machine = user.asset.getMachineById(model.id);
        ////cc.log("machine " + machine.coordinate.x + " " + machine.coordinate.y + " id " + machine.id + " slot " + machine.slot);
        //var bakery = new BakerySprite(0, 20, 20);
        //MapLayer.instance.addChild(bakery);
		var appleTree = new AppleTreeSprite();
		MapLayer.instance.addChild(appleTree);

		cc.log("res.infoMachineItem", res.infoMachineItem[0].price[0]);
		//MapCtrl.instance.addSpriteAlias(appleTree);
	},

	scheduleSoundChickenIdle01: function () {
		SoundCtrl.instance.playSoundEffect(res.ani_chicken_idle01_mp3, false);
	},

	scheduleSoundChickenIdle02: function () {
		SoundCtrl.instance.playSoundEffect(res.ani_chicken_idle02_mp3, false);
	},

	scheduleSoundCowIdle: function () {
		SoundCtrl.instance.playSoundEffect(res.ani_cow_idle_mp3, false);
	},

	disconnected: function() {
        LoadingScene.instance = new LoadingScene();
        LoadingScene.instance.setText(fr.Localization.text("text_disconnect"));
		cc.director.runScene(LoadingScene.instance);
	}
});
