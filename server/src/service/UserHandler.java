package service;

import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;

import cmd.CmdDefine;

import cmd.receive.user.RequestUserInfo;

import cmd.send.demo.ResponseGameInfo;
import cmd.send.demo.ResponseRequestUserInfo;

import config.enums.ProductResource;
import config.enums.ProductType;
import config.enums.StorageType;

import extension.FresherExtension;

import java.util.Date;

import model.Asset;
import model.Field;
import model.Storage;
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
            case CmdDefine.GET_USER_INFO:
                RequestUserInfo reqInfo = new RequestUserInfo(dataCmd);                
                getUserInfo(user);
                break;
            }
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }

    }

    private void getUserInfo(User user) {
        try {
//            ZPUserInfo userInfo = (ZPUserInfo) ZPUserInfo.getModel(user.getId(), ZPUserInfo.class);
            ZPUserInfo userInfo = (ZPUserInfo) ZPUserInfo.getModel(1, ZPUserInfo.class);
            if (userInfo == null) {
                
//                createUser(userInfo, user.getId());                
                userInfo = createUser(1);
                
//                userInfo.saveModel(user.getId());                
                userInfo.saveModel(1);
            }
            
            send(new ResponseGameInfo(userInfo), user);
            
        } catch (Exception e) {

        }

    }

    private void userDisconnect(User user) {
        // log user disconnect
    }




    public static ZPUserInfo createUser(int userId){
        
        Storage foodStorage = new Storage(StorageType.FOOD_STORAGE, 50, 10, 10);
        Storage warehouse = new Storage(StorageType.WAREHOUSE, 50, 8, 8);
        foodStorage.addItem(ProductType.CROP_CARROT, 5);
        foodStorage.addItem(ProductType.CROP_SOYBEAN,10);
        foodStorage.addItem(ProductType.CROP_INDIGO, 2);
        foodStorage.addItem(ProductType.CROP_TOMATO, 3);
        foodStorage.addItem(ProductType.CROP_STRAWBERRY, 4);
        
        Asset asset = new Asset(foodStorage, warehouse, null);
        for (int i = 1; i < 4; i++){
            Field field = new Field(0, 18, 10 + i);
            asset.addField(field);
        }
        System.out.println("Field number" + asset.getFieldList().size());
        asset.getFieldById(1).setPlantType(ProductType.CROP_CARROT);
        asset.getFieldById(1).setPlantedTime(new Date().getTime());
        
        ZPUserInfo userInfo = new ZPUserInfo(userId, asset);
        
        for (int i = 0; i < 3; i++){
            System.out.println("field" + asset.getFieldById(i).getFieldId() + ", " + asset.getFieldById(i).getPlantType() + ", " + asset.getFieldById(i).getPlantedTime());
        }
        
        return userInfo;
    }
    
}
