
var Asset = cc.Class.extend({

    foodStorage: Storages,
    warehouse: Storages,
    fieldList: null,
    machineList: null,
    natureThingList: null,
    myShop: null,
    orderList: [],
    orderNPCList: [],
    car: null,
    animalLodgeList: null,
    // map: [],

    ctor: function (foodStorage, warehouse, fieldList, animalLodgeList, machineList, natureThingList, myShop, orderList, orderNPCList, car) {
        //
        //this._super();

    //     this.render(foodStorage, warehouse, fieldList, animalLodgeList, machineList, natureThingList, myShop);

    // },
    // render: function (foodStorage, warehouse, fieldList, animalLodgeList, machineList, natureThingList, myShop) {
        //
        this.foodStorage = foodStorage;
        this.warehouse = warehouse;
        this.fieldList = fieldList || [];
        // cc.log("List", animalLodgeList);
        this.animalLodgeList = animalLodgeList || [];
        this.machineList = machineList || [];
        this.natureThingList = natureThingList || [];
        this.myShop = myShop;
        this.orderList = (orderList == null) ? [] : orderList;
        this.orderNPCList = (orderNPCList == null) ? [] : orderNPCList;
        this.car = car;
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
    getMachineById: function (machineId) {
        var machine = this.machineList.find(function(f) {
            return f.machineId === machineId;
        });

        return machine;
    },
    getFieldById: function(fieldId) {
        // for (var i = 0; i < this.fieldList.length; i++){
        //     if (this.fieldList[i].getFieldId() == fieldId){

        //         return this.fieldList[i];
        //     }
        // }
        // return null;
        return this.getFieldList().find(function(f) {
            return f.fieldId === fieldId;
        });
    },
    addField: function (field) {
        //bug   // ? where??
        this.fieldList.push(field);
        field.setFieldId(this.fieldList.length);
         //this.fieldList[this.fieldList.length - 1].setFieldId(this.fieldList.length - 1);    //autoincrement id

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
        if (machine.machineId === 0) {
            machine.machineId = this.machineList.length;
        }
    },

    addAnimalLodge: function (animalLodge) {
        this.animalLodgeList.push(animalLodge);
        if (animalLodge.id === 0) {
            animalLodge.id = this.animalLodgeList.length;
        }
    },

    getLodgeById: function(id) {
        var lodge =  this.animalLodgeList.find(function(lodge) {
            return lodge.id === id;
        });
        return lodge;
    },

//    //
    getCar: function () {
        return this.car;
    },

    getOrderList: function() {
        return this.orderList;
    },
    //
    getOrderNPCList: function() {
        return this.orderNPCList;
    },

    addOrder: function(/*level, */order){

        // if (this.orderList.size() < OrderUtil.getNumberOfOrderByLevel(level)){
            this.orderList.push(order);
            //this.orderList.get(this.orderList.size() - 1).setOrderId(this.orderList.size() - 1);

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

    getOrderNPCById: function (orderId) {
        for (var i = 0; i < this.orderNPCList.length; i++){
            if (this.orderNPCList[i].getOrderId() == orderId){
                return this.orderNPCList[i];

            }
        }
        return null;
    },

    getQuantityOfTwoStorageByProductId: function (productId) {
        var qFoodStorage = this.getFoodStorage().getQuantity(productId);
        var qWarehouse = this.getWarehouse().getQuantity(productId);

        return (qFoodStorage > qWarehouse) ? qFoodStorage : qWarehouse;
    },

    addItemToStorageById: function (productId, quantity) {
        if (productId.indexOf("crop_") >= 0){
            return this.getFoodStorage().addItem(productId, quantity);
        } else {
            return this.getWarehouse().addItem(productId, quantity);
        }
    },

    takeItemToStorageById: function (productId, quantity) {
        if (productId.indexOf("crop_") >= 0){
            return this.getFoodStorage().takeItem(productId, quantity);
        } else {
            return this.getWarehouse().takeItem(productId, quantity);
        }
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

    },
//
    getWaittingOrderNPCList: function () {
        var list = [];
        for (var i = 0; i < this.getOrderNPCList().length; i++) {
            if (this.getOrderNPCList()[i].checkStatus() == OrderStatusTypes.WAITTING) {
                list.push(this.getOrderNPCList()[i]);
            }
        }
        return list;
    },


    //
    getLodgeByPosition: function(lx, ly) {
        for (var i = 0; i < this.animalLodgeList.length; i++) {
            var lodge = this.animalLodgeList[i];
            var blx = lodge.coordinate.x;
            var bly = lodge.coordinate.y;
            var type = lodge.type;
            var width = 0;
            var height = 0;
            switch (type) {
                case 'chicken_habitat':
                    width = MapConfigs.ChickenLodge.size.width;
                    height = MapConfigs.ChickenLodge.size.height;
                    break;
                case 'cow_habitat':
                    width = MapConfigs.CowLodge.size.width;
                    height = MapConfigs.CowLodge.size.height;
                    break;
                default:
                    cc.log("Unhandled", type);
                    return null;
            }
            if (MapValues.positionInsideBlock(lx, ly, blx, bly, width, height)) {
                return lodge;
            }
        }
        return null;
    },


    getNatureThingById: function(natureId) {
        return this.natureThingList.find(function(nature) {
            return nature.id === natureId;
        });
    },

    removeNatureThing: function(natureId) {
        this.natureThingList = this.natureThingList.filter(function(nature) {
            return nature.id !== natureId;
        });
    },

    countAnimalByType: function (animalType) {
        var number = 0;
        for(var i = 0; i < this.animalLodgeList.length; i++) {
            if (this.animalLodgeList[i].type === (animalType + "_habitat")) {
                number += this.animalLodgeList[i].animalList.length;
            }
        }
        return number;
    }
});
