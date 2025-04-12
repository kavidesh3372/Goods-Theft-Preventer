package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.Inventory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface InventoryService {


    @Transactional
    ResponseEntity<?> processTransaction(String shopId, List<String> commodities, List<Integer> quantities, String destination, String vanId);

    List<Inventory> updateInventory();

    List<Inventory> getInventory();


}
