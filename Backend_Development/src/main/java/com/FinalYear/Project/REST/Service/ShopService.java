package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.Shop;

import java.util.Optional;

public interface ShopService {
    void addShop(Shop shop);

    Optional<Shop> getShop(String shopId);
}
