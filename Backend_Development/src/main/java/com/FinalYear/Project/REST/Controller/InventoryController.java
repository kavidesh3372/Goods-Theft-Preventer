package com.FinalYear.Project.REST.Controller;

import com.FinalYear.Project.Entity.Inventory;
import com.FinalYear.Project.REST.DTO.TransactionRequest;
import com.FinalYear.Project.REST.Service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/FinalYearProject/Inventory")
@CrossOrigin("*")
public class InventoryController {
    @Autowired
    public InventoryService inventoryService;

    @GetMapping
    public List<Inventory> getInventory() {
        return inventoryService.getInventory();
    }

    @PutMapping("/process-transaction")
    public ResponseEntity<?> processTransaction(@RequestBody TransactionRequest request) {
        return inventoryService.processTransaction(
                request.getShopId(),
                request.getCommodities(),  // ✅ List of commodity names
                request.getQuantities(),   // ✅ List of corresponding quantities
                request.getDestination(),
                request.getVanId()
        );
    }


}
