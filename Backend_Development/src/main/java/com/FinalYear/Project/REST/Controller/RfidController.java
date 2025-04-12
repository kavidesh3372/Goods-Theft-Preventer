package com.FinalYear.Project.REST.Controller;

import com.FinalYear.Project.Entity.Rfid;
import com.FinalYear.Project.REST.Service.InventoryService;
import com.FinalYear.Project.REST.Service.RfidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/FinalYearProject/Rfid")
@CrossOrigin("*")
public class RfidController {

    @Autowired
    private RfidService rfidService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<Rfid>> getRfid() {
        List<Rfid> rfid = rfidService.getRfid();
        return ResponseEntity.ok(rfid);
    }

    @PostMapping("/addRfid")
    public ResponseEntity<String> addRfid(@RequestBody Rfid rfid) {
        Optional<Rfid> existingRfid = rfidService.findByUId(rfid.getUId());
        if (existingRfid.isPresent()) {
            return ResponseEntity.status(409).body("RFID already exists");
        } else {
            rfidService.addRfid(rfid);
            rfidService.updateInventoryBasedOnExpiry();
            inventoryService.updateInventory();
            return ResponseEntity.ok("RFID added and Inventory updated successfully");
        }
    }

    @PutMapping("/updateRfid/{uId}")
    public ResponseEntity<String> updateRfid(@PathVariable String uId, @RequestBody Rfid updatedRfid) {
        Optional<Rfid> existingRfid = rfidService.findByUId(uId);

        if (existingRfid.isPresent()) {
            Rfid rfid = existingRfid.get();
            rfid.setCommodity(updatedRfid.getCommodity());
            rfid.setManufacturingDate(updatedRfid.getManufacturingDate());
            rfid.setExpiringDate(updatedRfid.getExpiringDate());
            rfid.setStatus(updatedRfid.getStatus());
            rfid.setDestination(updatedRfid.getDestination());
            rfidService.addRfid(rfid);
            inventoryService.updateInventory();
            return ResponseEntity.ok("RFID updated and Inventory refreshed successfully.");
        } else {
            return ResponseEntity.status(404).body("RFID not found with uId: " + uId);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkRfid(@RequestParam String uId) {
        Optional<Rfid> rfid = rfidService.findByUId(uId);
        return rfid.isPresent() ? ResponseEntity.ok(rfid.get()) : ResponseEntity.notFound().build();
    }

    @GetMapping("/checkExpiry")
    public void checkExpiry(){
        rfidService.checkAndUpdateExpiredRfids();
    }

    @GetMapping("/sortedByExpiry")
    public ResponseEntity<List<Rfid>> getRfidSortedByExpiry() {
        List<Rfid> sortedRfids = rfidService.getRfidSortedByExpiry();
        return ResponseEntity.ok(sortedRfids);
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<String> updateRfidStatus(@PathVariable String uId, @RequestBody String updatedRfidStatus) {
        boolean updated = rfidService.updateRfidStatus(uId,updatedRfidStatus);
        if (updated) {
            return ResponseEntity.ok("RFID status updated successfully.");
        }
        return ResponseEntity.badRequest().body("RFID UID not found.");
    }

}
