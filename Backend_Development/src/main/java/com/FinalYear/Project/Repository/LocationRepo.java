package com.FinalYear.Project.Repository;

import com.FinalYear.Project.Entity.Location;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepo extends MongoRepository<Location, ObjectId> {
    Location findByVanId(String vanId);
}
