package com.FinalYear.Project.Repository;

import com.FinalYear.Project.Entity.Location;
import com.FinalYear.Project.Entity.Rfid;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RfidRepo extends MongoRepository<Rfid, String> {
    List<Rfid> findByStatus(String status);

    List<Rfid> findByExpiringDate(LocalDate expiringDate);

    Optional<Rfid> findByuId(String uId);

    List<Rfid> findByCommodityAndStatus(String commodity, String status);
}
