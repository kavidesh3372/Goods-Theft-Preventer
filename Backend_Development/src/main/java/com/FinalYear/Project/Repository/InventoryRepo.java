package com.FinalYear.Project.Repository;

import com.FinalYear.Project.Entity.Inventory;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepo extends MongoRepository<Inventory, ObjectId> {
    Optional<Inventory> findByCommodity(String commodity);
}
