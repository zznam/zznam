package config.utils;

import config.enums.ProductCategory;

import config.enums.ProductType;

import config.jsonobject.CropProduct;
import config.jsonobject.ProductConfig;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import model.StorageItem;
import model.ZPUserInfo;

public class OrderNPCUtil {
    
    
    
    public static int getNPCRemainTime(int level){
        if (level < 11){
            return 2;
        } else if (level < 16){
            return 4;
        } else if (level < 21){
            return 4;
        } else if (level < 26){
            return 4;
        } else if (level < 31){
            return 6;
        } else if (level < 36){
            return 6;
        } else if (level < 41){
            return 6;
        } else {
            return 8;
        }
    }
    
    
    
    public static ProductCategory randomCategoryNPC(){
        float random = (float) Math.random();
        
        if (random < 0.4){
            return ProductCategory.CROP_PRODUCT;
        } else if (random < 0.65){
            return ProductCategory.TOOL_PRODUCT;
        } else if (random < 0.8){
            return ProductCategory.MACHINE_PRODUCT;
        } else if (random < 0.9){
            return ProductCategory.LIVESTOCK_PRODUCT;   //fruit_tree_product not in scope
        } else {
            return ProductCategory.MACHINE_PRODUCT;   //metal_product not in scope
        }
        
    }
    
    
    public static boolean randomProductExistsInStock(){
        
        return ((int) Math.floor(Math.random() * 2) == 1) ? true : false;
    }
    
    
    public static StorageItem randomProductConfByCategory(ZPUserInfo user, ProductCategory category){
        
        if (randomProductExistsInStock()){
            // 0.2 - 0.9 quantity of product in stock
            List<StorageItem> list = getItemListInStockByCategory(user, category);
            if (!list.isEmpty()){
                StorageItem item = list.get((int) Math.floor(Math.random() * 0.99 * list.size()));
                //
                return new StorageItem(item.getTypeItem(), (int) Math.ceil(item.getQuantity() * (Math.random() * 0.7 + 0.2)) );
            }
        }
        // 1 - 5 product
        List<ProductConfig> list = ProductUtil.getProductConfObjByCategory(category);
        //
        list = OrderUtil.filterProductByLevel(user.getLevel(), list);
        //
        if (list.isEmpty()){
            return new StorageItem(ProductType.CROP_WHEAT, 1);
        }
        ProductConfig item = list.get((int) Math.floor(Math.random() * 0.99 * list.size()));
        
        return new StorageItem(item.id, (int) (Math.random() * 0.99 * 5) + 1);
    }
    
    
    
    
    
    //
    public static List<StorageItem> getItemListInStockByCategory(ZPUserInfo user, ProductCategory category){
        
        List<StorageItem> itemListInStock = user.getAsset().getAllProductInStock();
        List<StorageItem> list = new ArrayList<>();
        
        switch (category){
            case CROP_PRODUCT:
                for (int i = 0; i < itemListInStock.size(); i++) {
                    if (itemListInStock.get(i).getTypeItem().contains("crop_")) {
                        list.add(itemListInStock.get(i));
                    }
                }
                break;
            case MACHINE_PRODUCT:
                for (int i = 0; i < itemListInStock.size(); i++) {
                    if (itemListInStock.get(i).getTypeItem().contains("product_")) {
                        list.add(itemListInStock.get(i));
                    }
                }
                break;
            case LIVESTOCK_PRODUCT:
                for (int i = 0; i < itemListInStock.size(); i++) {
                    if (itemListInStock.get(i).getTypeItem().contains("good_")) {
                        list.add(itemListInStock.get(i));
                    }
                }
                break;
        
        
            //
            case TOOL_PRODUCT:
                for (int i = 0; i < itemListInStock.size(); i++) {
                    if (itemListInStock.get(i).getTypeItem().contains("tool_")) {
                        list.add(itemListInStock.get(i));
                    }
                }
                break;
        
            default:
            
        }
        return list;
    }
    
    
    
    
}
