package service;

import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;

import cmd.CmdDefine;

import cmd.receive.user.RequestAddMoney;
import cmd.receive.user.RequestUserInfo;

import cmd.send.demo.ResponseErrorCode;
import cmd.send.demo.ResponseGameInfo;

import cmd.send.user.ResponseUser;

import config.enums.AnimalEnum;
import config.enums.AnimalLodgeEnum;
import config.enums.ErrorLog;
import config.enums.MachineTypeEnum;
import config.enums.ProductType;
import config.enums.StorageType;

import config.jsonobject.ProductConfig;
import config.jsonobject.machine.RawMaterial;
import config.jsonobject.map.NaturalObject;

import config.utils.ConfigContainer;

import config.utils.OrderNPCUtil;
import config.utils.OrderUtil;

import config.utils.ProductUtil;

import static config.utils.ProductUtil.getProductObjByType;

import extension.FresherExtension;

import java.util.ArrayList;
import java.util.Date;

import java.util.List;

import model.Animal;
import model.AnimalLodge;
import model.Asset;
import model.Field;
import model.Machine;
import model.MyShop;
import model.NatureThing;
import model.Order;
import model.OrderNPC;
import model.ProductSale;
import model.Storage;
import model.StorageItem;
import model.ZPUserInfo;

import org.apache.commons.lang.exception.ExceptionUtils;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserHandler extends BaseClientRequestHandler {
    public static short USER_MULTI_IDS = 1000;
    private final Logger logger = LoggerFactory.getLogger("UserHandler");
    
    public UserHandler() {
        super();
    }

    public void init() {
        getExtension().addEventListener(BZEventType.USER_DISCONNECT, this);
        getExtension().addEventListener(BZEventType.USER_RECONNECTION_SUCCESS, this);
    }

    private FresherExtension getExtension() {
        return (FresherExtension) getParentExtension();
    }

    public void handleServerEvent(IBZEvent ibzevent) {
        if (ibzevent.getType() == BZEventType.USER_DISCONNECT)
            this.userDisconnect((User) ibzevent.getParameter(BZEventParam.USER));
    }

    public void handleClientRequest(User user, DataCmd dataCmd) {
        try {
            switch (dataCmd.getId()) {
            case CmdDefine.GET_USER_INFO: // Old. Do not use
                RequestUserInfo reqInfo = new RequestUserInfo(dataCmd);                
                getUserInfo(user);
                break;
            case CmdDefine.GET_USER: // New get user
                //System.out.println("[INFO] User request information " + user.getId());
                returnUser(user);
                break;
            case CmdDefine.ADD_MONEY:
                RequestAddMoney reqAdd = new RequestAddMoney (dataCmd);
                processAddMoney(user, reqAdd);
                break;
            }
            
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }

    }

    private void getUserInfo(User user) {
        try {
            ZPUserInfo userInfo = (ZPUserInfo) ZPUserInfo.getModel(user.getId(), ZPUserInfo.class);
//            ZPUserInfo userInfo = (ZPUserInfo) ZPUserInfo.getModel(1, ZPUserInfo.class);
            if (userInfo == null) {
                
//                createUser(userInfo, user.getId());                
                userInfo = createUser(user.getId());
                
                userInfo.saveModel(user.getId());                
//                userInfo.saveModel(1);
            }
            
            
            send(new ResponseGameInfo(userInfo), user);
            
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    
    // Return all user information as Binary
    private void returnUser(User user) {
        ZPUserInfo userInfo = null;
        try {
            userInfo = (ZPUserInfo) ZPUserInfo.getModel(user.getId(), ZPUserInfo.class);
            if (userInfo == null) {
                
                userInfo = createUser(user.getId());
//                userInfo = initUser(user.getId());
                //
                userInfo.getAsset().getMyShop().sell(userInfo, 0, new StorageItem(ProductType.CROP_WHEAT, 5), 10);
                userInfo.getAsset().getMyShop().sell(userInfo, 3, new StorageItem(ProductType.GOOD_MILK, 3), 27);
                //
                
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        send(new ResponseUser(userInfo, 1), user);
        send(new ResponseUser(userInfo, 2), user);
        send(new ResponseUser(userInfo, 3), user);
        send(new ResponseUser(userInfo, 4), user);
        
    }

    private void userDisconnect(User user) {
        // log user disconnect
    }



    public static ZPUserInfo initUser(int userId){
        Storage foodStorage = new Storage(StorageType.FOOD_STORAGE, 50, 
                ConfigContainer.mapConfig.Silo.position.x,
                ConfigContainer.mapConfig.Silo.position.y);
        Storage warehouse = new Storage(StorageType.WAREHOUSE, 50, 
                ConfigContainer.mapConfig.Warehouse.position.x,
                ConfigContainer.mapConfig.Warehouse.position.y);

        
        //
        List<NatureThing> natureThingList = new ArrayList<>();
        for (int i = 0; i < ConfigContainer.defaultNatural.size(); i++) {
            NaturalObject nObj = ConfigContainer.defaultNatural.get(i);
            NatureThing nt = new NatureThing(nObj.id, nObj.type, nObj.x, nObj.y);
            natureThingList.add(nt);
        }
        
        MyShop myShop = new MyShop(6);
        
        Asset asset = new Asset(foodStorage, warehouse, null, natureThingList, null, null, myShop);
        
        //
        for (int i = 1; i < 5; i++){
            Field field = new Field(18, 12 + i);
            asset.addField(field);

            field.setPlantType(ProductType.CROP_WHEAT);
            field.setPlantedTime(new Date().getTime() - ProductUtil.getProductObjByType(field.getPlantType()).time * 1000 - 5000);
        }
        
        warehouse.addItem(ProductType.FOOD_CHICKEN, 3);
        
        //
        AnimalLodge chickenLodge = new AnimalLodge(AnimalLodgeEnum.chicken_habitat, 20, 20);
        asset.addAnimalLodge(chickenLodge);
        
        Animal animal3 = new Animal(AnimalEnum.chicken);
        animal3.setFeededTime(animal3.getFeededTime() - 1000 * 1200);
        animal3.setFeeded(true);
        chickenLodge.addAnimal(animal3);
        
        Animal animal4 = new Animal(AnimalEnum.chicken);
        animal4.setFeededTime(animal4.getFeededTime() - 1000 * 1200);
        animal4.setFeeded(true);
        chickenLodge.addAnimal(animal4);
        
        
        //
        Machine machine = new Machine(1, MachineTypeEnum.food_machine, 
                ConfigContainer.getMachineSlot(MachineTypeEnum.food_machine.toString()),
                0, false, true, 9, 24);
        asset.addMachine(machine);
        
        
        
//        ////
        ZPUserInfo userInfo = new ZPUserInfo(userId, asset); // ...Update map alias
        
        
        //
        for (int i = 0; i < OrderUtil.getNumberOfOrderByLevel(userInfo.getLevel()); i++){
            asset.addOrder(userInfo.getLevel(), new Order(userInfo, userInfo.getLevel()));
        }
        asset.addOrderNPC(new OrderNPC(userInfo));
        
        
        return userInfo;
    }


    public static ZPUserInfo createUser(int userId){
        
        Storage foodStorage = new Storage(StorageType.FOOD_STORAGE, 50, 
                ConfigContainer.mapConfig.Silo.position.x,
                ConfigContainer.mapConfig.Silo.position.y);
        Storage warehouse = new Storage(StorageType.WAREHOUSE, 100, 
                ConfigContainer.mapConfig.Warehouse.position.x,
                ConfigContainer.mapConfig.Warehouse.position.y);

        foodStorage.addItem(ProductType.CROP_CORN, 5);
        foodStorage.addItem(ProductType.CROP_WHEAT, 5);
        
        warehouse.addItem(ProductType.GOOD_EGG, 7);        
        warehouse.addItem(ProductType.GOOD_MILK, 7);
        warehouse.addItem(ProductType.TOOL_AXE, 1);
        warehouse.addItem(ProductType.TOOL_SAW, 2);
        warehouse.addItem(ProductType.TOOL_DYNOMITE, 1);
        warehouse.addItem(ProductType.TOOL_DEMOLITION_CHARGE, 2);
        warehouse.addItem(ProductType.TOOL_SHOVEL, 3);
        //
        
//        warehouse.addItem(ProductType.TOOL_NAIL, 5);
        warehouse.addItem(ProductType.TOOL_SCREW, 3);
        warehouse.addItem(ProductType.TOOL_WOODPANEL, 5);
        
//        warehouse.addItem(ProductType.TOOL_BOLT, 1);
        warehouse.addItem(ProductType.TOOL_PLANK, 4);
        warehouse.addItem(ProductType.TOOL_DUCTTAPE, 2);
        warehouse.addItem(ProductType.FOOD_CHICKEN, 1);
        warehouse.addItem(ProductType.FOOD_COW, 6);
        
        // Load natural thingList
        List<NatureThing> natureThingList = new ArrayList<>();
        for (int i = 0; i < ConfigContainer.defaultNatural.size(); i++) {
            NaturalObject nObj = ConfigContainer.defaultNatural.get(i);
            NatureThing nt = new NatureThing(nObj.id, nObj.type, nObj.x, nObj.y);
            natureThingList.add(nt);
//            System.out.println("id" + nObj.id + " type" + nObj.type);
        }
        
        MyShop myShop = new MyShop(6);
        
        
        Asset asset = new Asset(foodStorage, warehouse, null, natureThingList, null, null, myShop);
        
        // Add some fields
        for (int i = 1; i < 5; i++){
            Field field = new Field(18, 10 + i);
            asset.addField(field);
        }
//        System.out.println("Field number" + asset.getFieldList().size());
        asset.getFieldById(1).setPlantType(ProductType.CROP_CARROT);
        asset.getFieldById(1).setPlantedTime(new Date().getTime());
        
        // Add some animal lodges  
        AnimalLodge chickenLodge = new AnimalLodge(AnimalLodgeEnum.chicken_habitat, 20, 20);
        asset.addAnimalLodge(chickenLodge);
        AnimalLodge cowLodge = new AnimalLodge(AnimalLodgeEnum.cow_habitat, 20, 16);
        asset.addAnimalLodge(cowLodge);
        
        Animal animal = new Animal(AnimalEnum.chicken);
        animal.setFeededTime(animal.getFeededTime() - 1000 * 60 * 19 - 1000 * 40);
        animal.setFeeded(false);
        chickenLodge.addAnimal(animal);
        
        Animal animal2 = new Animal(AnimalEnum.chicken);
        animal2.setFeededTime(animal2.getFeededTime());
        animal2.setFeeded(false);
        chickenLodge.addAnimal(animal2);

        Animal animal21 = new Animal(AnimalEnum.chicken);
        animal2.setFeededTime(animal2.getFeededTime());
        animal2.setFeeded(false);
        chickenLodge.addAnimal(animal21);

        Animal animal22 = new Animal(AnimalEnum.chicken);
        animal2.setFeededTime(animal2.getFeededTime());
        animal2.setFeeded(false);
        chickenLodge.addAnimal(animal22);

        Animal animal23 = new Animal(AnimalEnum.chicken);
        animal2.setFeededTime(animal2.getFeededTime());
        animal2.setFeeded(false);
        chickenLodge.addAnimal(animal23);

        Animal animal24 = new Animal(AnimalEnum.chicken);
        animal2.setFeededTime(animal2.getFeededTime());
        animal2.setFeeded(false);
        chickenLodge.addAnimal(animal24);
        
        Animal animal3 = new Animal(AnimalEnum.cow);
        animal3.setFeededTime(animal3.getFeededTime() - 1000 * 3600);
        animal3.setFeeded(true);
        cowLodge.addAnimal(animal3);
        
        Animal animal4 = new Animal(AnimalEnum.cow);
        animal4.setFeededTime(animal4.getFeededTime());
        animal4.setFeeded(true);
        cowLodge.addAnimal(animal4);

//        // Add Food Machine
//        Machine machine = new Machine(1, MachineTypeEnum.food_machine, 
//                        ConfigContainer.getMachineSlot(MachineTypeEnum.food_machine.toString()),
//                        0, false, true, 9, 24);
//        // Add Bakery Machine
//        Machine machine2 = new Machine(2, MachineTypeEnum.bakery_machine, 
//                        ConfigContainer.getMachineSlot(MachineTypeEnum.food_machine.toString()),
//                        0, false, true, 20, 24);
//        
//        asset.addMachine(machine);
//        asset.addMachine(machine2);
       
        
        // Last
        ZPUserInfo userInfo = new ZPUserInfo(userId, asset); // ...Update map alias
        
//        for (int i = 0; i < 3; i++){
//            System.out.println("field" + asset.getFieldById(i).getFieldId() + ", " + asset.getFieldById(i).getPlantType() + ", " + asset.getFieldById(i).getPlantedTime());
//        }
        
        
        
        //
        for (int i = 0; i < OrderUtil.getNumberOfOrderByLevel(userInfo.getLevel()); i++){
//            asset.addOrder(userInfo.getLevel(), new Order(userInfo.getLevel()));
            asset.addOrder(userInfo.getLevel(), new Order(userInfo, userInfo.getLevel()));
        }
        
        //
        for (int i = 0; i < 1; i++){
            asset.addOrderNPC(new OrderNPC(userInfo));
        }
        
        for (int i = 0; i < asset.getOrderNPCList().size(); i++){
            System.out.println(asset.getOrderNPCList().get(i).getOrderItem().getTypeItem() + ", " + 
                               asset.getOrderNPCList().get(i).getOrderItem().getQuantity() + ", " + 
                               asset.getOrderNPCList().get(i).getOrderPrice() + ", " + 
                               asset.getOrderNPCList().get(i).getOrderExp() + ", " + 
                               asset.getOrderNPCList().get(i).getNpcResAni());
        }
        
        
        return userInfo;
    }
    
    private void processAddMoney (User user, RequestAddMoney reqAdd) {
        ZPUserInfo userInfo = null;
        try {
            userInfo = (ZPUserInfo) ZPUserInfo.getModel(user.getId(), ZPUserInfo.class);
        } catch (Exception e) {
            e.printStackTrace();  
        }
        if (userInfo == null) {
            return;    
        }
        
        if (reqAdd.type == 1101) {
            userInfo.addGold(reqAdd.number);
        } else if (reqAdd.type == 1102) {
            userInfo.addRuby(reqAdd.number);
        }
        send(new ResponseErrorCode(ErrorLog.SUCCESS.getValue()), user);
        
        try {
            userInfo.saveModel(user.getId());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}
