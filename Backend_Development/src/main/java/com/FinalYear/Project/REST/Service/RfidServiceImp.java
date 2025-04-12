package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.Rfid;
import com.FinalYear.Project.Repository.RfidRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
public class RfidServiceImp implements RfidService {

    @Autowired
    private RfidRepo rfidRepo;

    @Autowired
    private InventoryService inventoryService;

    public void addRfid(Rfid rfid) {
        rfidRepo.save(rfid);
    }

    public List<Rfid> getRfid() {
        return rfidRepo.findAll(Sort.by(Sort.Direction.ASC, "_id"));
    }

    public List<Rfid> getRfidSortedByExpiry() {
        return rfidRepo.findAll(Sort.by(Sort.Direction.ASC, "expiringDate"));
    }

    public Optional<Rfid> findByUId(String uId) {
        return rfidRepo.findByuId(uId);
    }

    public void updateInventoryBasedOnExpiry() {
        List<Rfid> expiredRfidList = rfidRepo.findAll().stream()
                .filter(rfid -> rfid.getExpiringDate().isBefore(LocalDate.now().atStartOfDay()))
                .toList();

        for (Rfid rfid : expiredRfidList) {
            rfid.setStatus("Expired");
            rfidRepo.save(rfid);
        }
        inventoryService.updateInventory();
    }

    public boolean updateRfidStatus(String uid, String status) {
        Optional<Rfid> optionalRfid = rfidRepo.findById(uid);
        if (optionalRfid.isPresent()) {
            Rfid rfid = optionalRfid.get();
            rfid.setStatus(status);
            rfidRepo.save(rfid);
            return true;
        }
        return false;
    }


    @Scheduled(cron = "0 0 0 * * ?")
    public void checkAndUpdateExpiredRfids() {
        updateInventoryBasedOnExpiry();
    }
}
