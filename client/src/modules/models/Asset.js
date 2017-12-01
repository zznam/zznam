
var Asset = cc.Class.extend({

    foodStorage: Storages,
    warehouse: Storages,
    fieldList: [],
    animalLodgeList: [],
    machineList: [],
    natureThingList: [],
    myShop: null,
    orderList: [],
    // map: [],

    ctor: function (foodStorage, warehouse, fieldList, animalLodgeList, machineList, natureThingList, myShop, orderList) {
        //
        //this._super();

    //     this.render(foodStorage, warehouse, fieldList, animalLodgeList, machineList, natureThingList, myShop);

    // },
    // render: function (foodStorage, warehouse, fieldList, animalLodgeList, machineList, natureThingList, myShop) {
        //
        this.foodStorage = foodStorage;
        this.warehouse = warehouse;
        this.fieldList = (fieldList == null) ? [] : fieldList;
        this.animalLodgeList = (animalLodgeList == null) ? [] : animalLodgeList;
        this.machineList = (machineList == null) ? [] : machineList;
        this.natureThingList = natureThingList || [];
        this.myShop = myShop;
        this.orderList = (orderList == null) ? [] : orderList;
        // this.fieldList = [];
    },

    getFoodStorage: function () {
        return this.foodStorage;
    },
    getWarehouse: function () {
        return this.warehouse;
    },
    getFieldList: function () {
        return this.fieldList;
    },
    getAnimalLodgeList: function () {
        return this.animalLodgeList;
    },
    getMachineList: function () {
        return this.machineList;
    },
    getNatureThingList: function () {
        return this.natureThingList;
    },
    getMyShop: function () {
        return this.myShop;
    },

    getFieldById: function(fieldId) {
        for (var i = 0; i < this.fieldList.length; i++){
            if (this.fieldList[i].getFieldId() == fieldId){

                return this.fieldList[i];
            }
        }
        return null;
    },
    addField: function (field) {
        //bug   // ? where??
        this.fieldList.push(field);

        this.fieldList[this.fieldList.length - 1].setFieldId(this.fieldList.length - 1);    //autoincrement id

    },

    //
    getFieldByLogicPosition: function (lx, ly) {
        for (var i = 0; i < this.fieldList.length; i++){

            // cc.log(this.fieldList[i].getCoordinate().getCurrX() + ", +  " + this.fieldList[i].getCoordinate().getCurrY());

            if (this.fieldList[i].getCoordinate().getCurrX() == lx){
                if (this.fieldList[i].getCoordinate().getCurrY() == ly){

                    return this.fieldList[i];
                }

            }
        }
        return null;
    },

    addMachine: function (machine) {
        this.machineList.push(machine);
    },

    //
    getOrderList: function() {
        return this.orderList;
    },

    addOrder: function(/*level, */order){

        // if (this.orderList.size() < OrderUtil.getNumberOfOrderByLevel(level)){
            this.orderList.add(order);
            this.orderList.get(this.orderList.size() - 1).setOrderId(this.orderList.size() - 1);

            return true;
        // }
        /*
         * inprogress
         */
        // return false;
    },
    getOrderById: function (orderId) {
        for (var i = 0; i < this.orderList.length; i++){
            if (this.orderList[i].getOrderId() == orderId){
                return this.orderList[i];

            }
        }
        return null;
    },

    getQuantityOfTwoStorageByProductId: function (productId) {
        var qFoodStorage = this.getFoodStorage().getQuantity(productId);
        var qWarehouse = this.getWarehouse().getQuantity(productId);

        return (qFoodStorage > qWarehouse) ? qFoodStorage : qWarehouse;
    },

    //
    getWaittingOrderList: function () {
        var list = [];
        for (var i = 0; i < this.getOrderList().length; i++){
            if (this.getOrderList()[i].checkStatus() == OrderStatusTypes.WAITTING){
                list.push(this.getOrderList()[i]);
            }
        }
        return list;
    }

});