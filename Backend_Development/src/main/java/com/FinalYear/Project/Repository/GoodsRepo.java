package com.FinalYear.Project.Repository;

import com.FinalYear.Project.Entity.Goods;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoodsRepo extends MongoRepository<Goods,ObjectId> {

}
