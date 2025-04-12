package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.Shop;
import com.FinalYear.Project.REST.Service.ShopService;
import com.FinalYear.Project.Repository.ShopRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ShopServiceImp implements ShopService {
    @Autowired
    private ShopRepo shopRepo;

    public void addShop(Shop shop) {

        shopRepo.save(shop);
    }

    public Optional<Shop> getShop(String shopId) {
        return shopRepo.findByShopId(shopId);
    }
}
