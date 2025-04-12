package com.FinalYear.Project.Repository;


import com.FinalYear.Project.Entity.Shop;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepo extends MongoRepository<Shop, ObjectId> {
    Optional<Shop> findByShopId(String shopId);  // Fetch by custom Long shopId
}
