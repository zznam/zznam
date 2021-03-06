/**
 * Created by CPU60075_LOCAL on 12/21/2017.
 */

var MyShopLayout = BaseLayout.extend({
    cartStatus: 1,
    //cartStatus: 2,
    //cartStatus: 3,

    cartList: null,
    slotClickCurr: null,

    ctor: function (id) {
        this._super(res.roadshop_bg_in, id, true, true);

        this._title.y = this.height / 10 * 9;
        this._btnClose.y = this.height / 10 * 9;

        //
        this.cartList = user.asset.myShop.productList;
        //

        var bangten = new cc.Sprite(res.bangten);
        bangten.x = this.width / 2;
        bangten.y = this.height;
        bangten.setAnchorPoint(0.5, 0.9);

        var bg2 = new cc.Sprite(res.roadshop_bg_out);
        bg2.x = this.width / 2;
        bg2.y = this.height / 2;

        this._listCart = new cc.TableView(this, cc.size(this.width, this.height / 5 * 3));
        this._listCart.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._listCart.x = 0;
        this._listCart.y = this.height / 10 * 3;
        this._listCart.setDelegate(this);
        this._listCart.reloadData();

        var arrowLeft = new cc.Sprite(res.arrowLeft);
        arrowLeft.x = 0;
        arrowLeft.y = this.height / 9;
        arrowLeft.setAnchorPoint(0, 0.5);
        arrowLeft.setScaleX(1.2);

        var friendLeft = new FriendWithLevel(0, res.henry, 0, 50);
        friendLeft.x = arrowLeft.getBoundingBox().width / 2;
        friendLeft.y = arrowLeft.getBoundingBox().height / 3 * 2;
        friendLeft.setScale(0.8);
        friendLeft.setAnchorPoint(0.5 , 0.5);
        arrowLeft.addChild(friendLeft);

        var arrowRight = new cc.Sprite(res.arrowRight);
        arrowRight.x = this.width;
        arrowRight.y = this.height / 9;
        arrowRight.setAnchorPoint(1.0, 0.5);
        arrowRight.setScaleX(1.2);

        var friendRight = new FriendWithLevel(0, res.henry, 0, 50);
        friendRight.x = arrowRight.getBoundingBox().width / 2;
        friendRight.y = arrowRight.getBoundingBox().height / 3 * 2;
        friendRight.setScale(0.8);
        friendRight.setAnchorPoint(0.75, 0.5);
        arrowRight.addChild(friendRight);

        this._bg.addChild(this._listCart);
        this._bg.addChild(bg2);
        this._bg.addChild(bangten);
        this.addChild(arrowLeft);
        this.addChild(arrowRight);
    },

    tableCellTouched: function (table, cell) {
        cc.log("tableCellTouched", cell.getIdx());
    },

    tableCellSizeForIndex: function (table, idx) {
        return cc.size(this.width / 3.5, this.height / 5 * 2);
    },

    tableCellAtIndex: function (table, idx) {
        var cell = table.dequeueCell();

        cell = new cc.TableViewCell();

        this.cartLayout = new ccui.Layout();
        this.cartLayout.setContentSize(cc.size(this.width / 3.5, this.height / 5 * 2));

        var cart = new ccui.Button(res.roadshop_cart);
        cart.x = this.cartLayout.width / 2;
        cart.y = this.cartLayout.height / 2;
        cart.setScaleY(this.cartLayout.height / cart.height);
        cart.setZoomScale(0);
        cart.addTouchEventListener(this.onClickCart, this);
        cart.setSwallowTouches(false);
        this.cartLayout.addChild(cart);


        /////
        if (idx < this.cartList.length){
            /////
            this.customCell(this.cartLayout, idx);
            //
        } else {
            // var btn = new ccui.Button(res.storage_buy_tool);
            var btn = new cc.Sprite(res.storage_buy_tool);
            btn.x = this.cartLayout.width / 2;
            btn.y = this.cartLayout.height / 3 * 2;
            // btn.addTouchEventListener(this.touchBuySlot, this);
            btn.setScale(0.8);
            this.cartLayout.addChild(btn);

            var ruby = new cc.Sprite(res.ruby_small);
            ruby.x = btn.width / 4 * 3;
            ruby.y = btn.height / 4;
            //cc.log("ruby" + ruby);
            btn.addChild(ruby);

            var numberRubyLabel = new cc.LabelBMFont("5", res.FONT_OUTLINE_30);
            numberRubyLabel.x = btn.width / 3;
            numberRubyLabel.y = btn.height / 4;
            btn.addChild(numberRubyLabel);
        }

        //if(idx < 7 - 1) {
        //    switch (this.cartStatus) {
        //        case 1:
        //            var string = fr.Localization.text("text_create_new_sale");
        //            string = string.replace("\\n", "\n");
        //            var sellLabel = new cc.LabelBMFont(string, res.FONT_NORMAL_30);
        //            sellLabel.x = cartLayout.width / 2;
        //            sellLabel.y = cartLayout.height / 3 * 2;
        //            sellLabel.color = cc.color(72, 38, 0);
        //            sellLabel.setLineBreakWithoutSpace(false);
        //            sellLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
        //            cartLayout.addChild(sellLabel);
        //            break;
        //        case 2:
        //            var numberLabel = new cc.LabelBMFont("8x", res.FONT_OUTLINE_30);
        //            numberLabel.x = cartLayout.width / 4;
        //            numberLabel.y = cartLayout.height / 25 * 22;
        //            cartLayout.addChild(numberLabel);
        //
        //            var productImg = new cc.Sprite(res.storage_apple);
        //            productImg.setScale(0.7);
        //            productImg.x = cartLayout.width / 2;
        //            productImg.y = cartLayout.height / 3 * 2;
        //            cartLayout.addChild(productImg);
        //
        //            var priceImg = new cc.Sprite(res.price_table);
        //            priceImg.setScale(0.8);
        //            priceImg.x = cartLayout.width / 3 * 2;
        //            priceImg.y = cartLayout.height / 10 * 2;
        //
        //            var goldImg = new cc.Sprite(res.gold_png);
        //            goldImg.x = priceImg.getBoundingBox().width / 5 * 4;
        //            goldImg.y = priceImg.getBoundingBox().height / 5 * 3;
        //            var priceLabel = new cc.LabelBMFont("320", res.FONT_OUTLINE_30);
        //            priceLabel.x = priceImg.getBoundingBox().width / 5 * 3;
        //            priceLabel.y = priceImg.getBoundingBox().height / 5 * 3;
        //            priceLabel.setAnchorPoint(1.0, 0.5);
        //            priceLabel.rotation = 15;
        //            priceImg.addChild(goldImg);
        //            priceImg.addChild(priceLabel);
        //            cartLayout.addChild(priceImg);
        //            break;
        //        case 3:
        //            var soldLabel = new cc.LabelBMFont(fr.Localization.text("text_sold"), res.FONT_OUTLINE_30);
        //            soldLabel.x = cartLayout.width / 4;
        //            soldLabel.y = cartLayout.height / 25 * 21;
        //            soldLabel.rotation = -15;
        //
        //            var frame = new cc.Sprite(res.friend_avatar);
        //            frame.x = cartLayout.width / 2;
        //            frame.y = cartLayout.height / 3 * 2;
        //            frame.setScaleY(0.9);
        //            var avatar = new cc.Sprite(res.henry);
        //            avatar.x = cartLayout.width / 2;
        //            avatar.y = cartLayout.height / 20 * 13;
        //            avatar.setScale(77/122);
        //            avatar.setScaleY(77/122 - 0.05);
        //            var name = new cc.LabelBMFont("Henry", res.FONT_OUTLINE_20);
        //            name.x = cartLayout.width / 2;
        //            name.y = cartLayout.height / 3;
        //
        //            var priceLabel = new cc.LabelBMFont("150", res.FONT_OUTLINE_30);
        //            priceLabel.x = cartLayout.width / 2;
        //            priceLabel.y = cartLayout.height / 6;
        //            priceLabel.setAnchorPoint(1.0, 0.5);
        //            var goldImg = new cc.Sprite(res.gold_png);
        //            goldImg.x = cartLayout.width / 5 * 3;
        //            goldImg.y = cartLayout.height / 6;
        //            //goldImg.setAnchorPoint(0, 0.5);
        //
        //            cartLayout.addChild(avatar);
        //            cartLayout.addChild(frame);
        //            cartLayout.addChild(soldLabel);
        //            cartLayout.addChild(name);
        //            cartLayout.addChild(priceLabel);
        //            cartLayout.addChild(goldImg);
        //            break;
        //    }
        //} else {
        //    var btn = new ccui.Button(res.storage_buy_tool);
        //    btn.x = cartLayout.width / 2;
        //    btn.y = cartLayout.height / 3 * 2;
        //    btn.addTouchEventListener(this.touchBuySlot, this);
        //    btn.setScale(0.8);
        //    cartLayout.addChild(btn);
        //
        //    var ruby = new cc.Sprite(res.ruby_small);
        //    ruby.x = btn.width / 4 * 3;
        //    ruby.y = btn.height / 4;
        //    //cc.log("ruby" + ruby);
        //    btn.addChild(ruby);
        //
        //    var numberRubyLabel = new cc.LabelBMFont("5", res.FONT_OUTLINE_30);
        //    numberRubyLabel.x = btn.width / 3;
        //    numberRubyLabel.y = btn.height / 4;
        //    btn.addChild(numberRubyLabel);
        //}

        //cartLayout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        //if(idx % 2) {
        //    cartLayout.setBackGroundColor(cc.color.GREEN);
        //} else {
        //    cartLayout.setBackGroundColor(cc.color.YELLOW);
        //}

        cell.addChild(this.cartLayout);

        return cell;
    },

    numberOfCellsInTableView: function (table) {
        // return this.cartList.length + 1;
        return (this.cartList.length < 12) ? (this.cartList.length + 1) : 12;
    },

    actionShow: function () {
        var scaleX = cc.winSize.width * 0.9 / this.width;
        var scaleY = cc.winSize.height / this.height;
        var scaleUp = cc.scaleTo(0.2, scaleX + 0.1, scaleY + 0.1);
        var scaleDown = cc.scaleTo(0.2, scaleX, scaleY);
        this.runAction(cc.sequence(scaleUp, cc.delayTime(0.05), scaleDown));

        this._title.setScaleY(scaleX / scaleY);
        this._btnClose.setScaleY(scaleX / scaleY);
    },

    touchBuySlot: function (sender, type) {
        // Buy slot
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log("touchBuySlot")
                break;
        }
    },

    onClickCart: function (sender, type) {
        // Click cart
        // Action follow status
        // var isMove = false;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                sender.parent.runAction(new cc.ScaleTo(0.1, 0.95));
                break;
            case ccui.Widget.TOUCH_ENDED:
                /**
                 * Process in here
                 */
                sender.parent.runAction(new cc.ScaleTo(0.1, 1.0));
                // if (isMove){
                //     break;
                // }
                if (sender.parent.parent.getIdx() < this.cartList.length) {
                    var product = this.cartList[sender.parent.parent.getIdx()];

                    // if (this.cartList[sender.parent.parent.getIdx()].product == null){
                    if (product.product == null){
                        BaseGUILayer.instance.removeBlockListener();
                        BaseGUILayer.instance.showSellGUI(product.slot);
                        //this.setVisible(false);
                        break;

                    // } else if (!this.cartList[sender.parent.parent.getIdx()].isSold){
                    } else if (!product.isSold){
                        BaseGUILayer.instance.removeBlockListener();
                        BaseGUILayer.instance.showEditGui(product.slot);

                        break;
                    } else {
                        if(MyShopCtrl.instance.onReceiveMoney(product.slot)){
                            //
                            this.cartList = user.asset.myShop.productList;
                            this._listCart.updateCellAtIndex(product.slot);
                            // this._listCart.reloadData();
                        }

                        break;
                    }
                } else {
                    if(MyShopCtrl.instance.onUnlockSlot()){
                        //
                        this.cartList = user.asset.myShop.productList;
                        // this._listCart.reloadData();
                        if (this.cartList.length < 12){
                            this._listCart.insertCellAtIndex(this.cartList.length - 1);
                        } else {
                            this._listCart.updateCellAtIndex(11);
                        }
                    }

                }

            case ccui.Widget.TOUCH_CANCELED:
                sender.parent.runAction(cc.sequence(cc.ScaleTo(0.15, 1.15), cc.ScaleTo(0.1, 1.0)));
                break;
        }
    },



    //
    customCell: function (cartLayout, idx) {

        if (this.cartList[idx].product == null){
            this.cellEmpty(cartLayout);

        } else if (!this.cartList[idx].isSold){
            this.cellSelling(cartLayout, idx);

        } else {
            this.cellSold(cartLayout, idx);
        }
    },

    cellEmpty: function (cartLayout) {
        var string = fr.Localization.text("text_create_new_sale");
        string = string.replace("\\n", "\n");
        var sellLabel = new cc.LabelBMFont(string, res.FONT_NORMAL_30);
        sellLabel.x = cartLayout.width / 2;
        sellLabel.y = cartLayout.height / 3 * 2;
        sellLabel.color = cc.color(72, 38, 0);
        sellLabel.setLineBreakWithoutSpace(false);
        sellLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
        cartLayout.addChild(sellLabel);
    },
    cellSelling: function (cartLayout, idx) {
        //var numberLabel = new cc.LabelBMFont("8x", res.FONT_OUTLINE_30);
        var numberLabel = new cc.LabelBMFont(this.cartList[idx].product.quantity + "x", res.FONT_OUTLINE_30);
        numberLabel.x = cartLayout.width / 4;
        numberLabel.y = cartLayout.height / 25 * 22;
        cartLayout.addChild(numberLabel);

        var productImg = new cc.Sprite(getProductIconById(this.cartList[idx].product.typeItem));
        // var productImg = new ccui.Button(getProductIconById(this.cartList[idx].product.typeItem));
        productImg.setScale(0.7);
        productImg.x = cartLayout.width / 2;
        productImg.y = cartLayout.height / 3 * 2;
        cartLayout.addChild(productImg);

        // var priceImg = new cc.Sprite(res.price_table);
        var priceImg = new ccui.ImageView(res.price_table);
        priceImg.setScale(0.8);
        priceImg.x = cartLayout.width / 4 * 3;
        priceImg.y = cartLayout.height / 10 * 2;

        //var goldImg = new cc.Sprite(res.gold_png);
        var goldImg = new ccui.ImageView(res.gold_png);
        goldImg.x = priceImg.getBoundingBox().width / 5 * 4;
        goldImg.y = priceImg.getBoundingBox().height / 5 * 3;
        //var priceLabel = new cc.LabelBMFont("320", res.FONT_OUTLINE_30);

        var priceLabel = new cc.LabelBMFont(this.cartList[idx].price, res.FONT_OUTLINE_30);
        priceLabel.x = priceImg.getBoundingBox().width / 5 * 3;
        priceLabel.y = priceImg.getBoundingBox().height / 5 * 3;
        priceLabel.setAnchorPoint(1.0, 0.5);
        priceLabel.rotation = 15;
        priceImg.addChild(goldImg);
        priceImg.addChild(priceLabel);
        cartLayout.addChild(priceImg);
    },
    cellSold: function (cartLayout, idx) {
        var soldLabel = new cc.LabelBMFont(fr.Localization.text("text_sold"), res.FONT_OUTLINE_30);
        soldLabel.x = cartLayout.width / 4;
        soldLabel.y = cartLayout.height / 25 * 21;
        soldLabel.rotation = -15;

        //var frame = new cc.Sprite(res.friend_avatar);
        var frame = new ccui.ImageView(res.friend_avatar);
        frame.x = cartLayout.width / 2;
        frame.y = cartLayout.height / 3 * 2;
        frame.setScaleY(0.9);

        //var avatar = new cc.Sprite(res.henry);
        var avatar = new ccui.ImageView(res.henry);
        avatar.x = cartLayout.width / 2;
        avatar.y = cartLayout.height / 20 * 13;
        avatar.setScale(77/122);
        avatar.setScaleY(77/122 - 0.05);
        var name = new cc.LabelBMFont("Henry", res.FONT_OUTLINE_20);
        name.x = cartLayout.width / 2;
        name.y = cartLayout.height / 3;

        //var priceLabel = new cc.LabelBMFont("150", res.FONT_OUTLINE_30);
        var priceLabel = new cc.LabelBMFont(this.cartList[idx].price, res.FONT_OUTLINE_30);
        priceLabel.x = cartLayout.width / 2;
        priceLabel.y = cartLayout.height / 6;
        priceLabel.setAnchorPoint(1.0, 0.5);
        var goldImg = new cc.Sprite(res.gold_png);
        goldImg.x = cartLayout.width / 5 * 3;
        goldImg.y = cartLayout.height / 6;
        //goldImg.setAnchorPoint(0, 0.5);

        cartLayout.addChild(avatar);
        cartLayout.addChild(frame);
        cartLayout.addChild(soldLabel);
        cartLayout.addChild(name);
        cartLayout.addChild(priceLabel);
        cartLayout.addChild(goldImg);
    }
});