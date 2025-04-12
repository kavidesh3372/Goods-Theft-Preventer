package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.Rfid;
import java.util.List;
import java.util.Optional;

public interface RfidService {
    void addRfid(Rfid rfid);

    List<Rfid> getRfid();

    Optional<Rfid> findByUId(String uId);

    List<Rfid> getRfidSortedByExpiry();

    void updateInventoryBasedOnExpiry();
    void checkAndUpdateExpiredRfids();

    boolean updateRfidStatus(String uid, String status);
}
