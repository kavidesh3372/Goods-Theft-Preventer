package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.*;
import com.FinalYear.Project.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImp implements InventoryService {

    @Autowired
    private InventoryRepo inventoryRepo;

    @Autowired
    private RfidRepo rfidRepo;

    @Autowired
    private GoodsRepo goodsRepo;

    @Autowired
    private LocationRepo locationRepo;

    @Autowired
    private ShopRepo shopRepo;

    private static final double SIVAGANGAI_LATITUDE = 9.8477;
    private static final double SIVAGANGAI_LONGITUDE = 78.4802;

    @Override
    @Transactional
    public ResponseEntity<?> processTransaction(String shopId, List<String> commodities, List<Integer> quantities, String destination, String vanId) {
        System.out.println("🔄 Starting transaction for Van ID: " + vanId);

        try {
            if (vanId.isEmpty() || shopId.isEmpty() || destination == null || commodities == null || quantities == null || commodities.isEmpty() || quantities.isEmpty()) {
                System.out.println("❌ Input is required.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "All input fields must be filled"));
            }

            if (commodities.size() != quantities.size()) {
                System.out.println("❌ Mismatch between commodities and quantities.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Commodities and quantities lists must have the same size."));
            }

            Optional<Shop> shop = shopRepo.findByShopId(shopId);
            if (shop.isEmpty()) {
                System.out.println("❌ Shop not found: " + shopId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Shop ID " + shopId + " not found."));
            }

            Optional<Location> location = Optional.ofNullable(locationRepo.findByVanId(vanId));
            if (location.isEmpty()) {
                System.out.println("❌ van ID not found: " + vanId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Van ID " + vanId + " not found."));
            }

            int totalQuantity = 0;
            for(int i=0;i<commodities.size();i++){
                String commodity = commodities.get(i);
                int quantity = quantities.get(i);
                Inventory inventory = inventoryRepo.findByCommodity(commodity)
                        .orElseThrow(() -> new IllegalArgumentException("Commodity not found: " + commodity));
                if (quantity <= 0) {
                    System.out.println("❌ Stock level cannot be zero or negative for: " + commodity);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid quantity for " + commodity));
                }

                if (inventory.getStockLevel() < quantity) {
                    System.out.println("❌ Insufficient stock for: " + commodity);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Insufficient stock for " + commodity));
                }
            }


            for (int i = 0; i < commodities.size(); i++) {
                String commodity = commodities.get(i);
                int quantity = quantities.get(i);

                Inventory inventory = inventoryRepo.findByCommodity(commodity)
                        .orElseThrow(() -> new IllegalArgumentException("Commodity not found: " + commodity));


                List<Rfid> rfidList = rfidRepo.findByCommodityAndStatus(commodity, "Available").stream()
                        .filter(rfid -> rfid.getExpiringDate() != null && rfid.getExpiringDate().isAfter(LocalDate.now().atStartOfDay()))
                        .sorted(Comparator.comparing(Rfid::getExpiringDate))
                        .limit(quantity)
                        .toList();

                if (rfidList.size() < quantity) {
                    System.out.println("❌ Not enough RFID tags available (non-expired) for: " + commodity);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Not enough non-expired RFID tags for " + commodity));
                }

                for (Rfid rfid : rfidList) {
                    rfid.setStatus("Transferred");
                    rfid.setDestination(destination);
                }
                rfidRepo.saveAll(rfidList);

                inventory.setStockLevel(inventory.getStockLevel() - quantity);
                inventoryRepo.save(inventory);
                System.out.println("✅ Inventory updated for " + commodity + ": " + inventory.getStockLevel());

                totalQuantity += quantity;
            }

            Goods goods = new Goods();
            goods.setShopId(shopId);
            goods.setStatus("In Transit");
            goods.setDestination(destination);
            goods.setStockLevel(totalQuantity);
            goodsRepo.save(goods);
            System.out.println("✅ Goods entry created with total quantity: " + totalQuantity);

            Location location1 = location.get();
            location1.setVanId(vanId);
            location1.setShopId(shopId);
            location1.setCount(totalQuantity);
            location1.setSourceLatitude(SIVAGANGAI_LATITUDE);
            location1.setSourceLongitude(SIVAGANGAI_LONGITUDE);
            location1.setDestinationLatitude(shop.get().getLatitude());
            location1.setDestinationLongitude(shop.get().getLongitude());
            locationRepo.save(location1);
            System.out.println("📍 Location updated for Van ID: " + vanId);

            return ResponseEntity.ok(Map.of("message", "Transaction completed successfully for Van ID: " + vanId));

        } catch (Exception e) {
            System.err.println("❌ Error in transaction: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Transaction failed: " + e.getMessage()));
        }
    }

    @Override
    public List<Inventory> updateInventory() {
        List<Rfid> availableRfids = rfidRepo.findByStatus("Available");
        Map<String, Long> commodityCounts = availableRfids.stream()
                .collect(Collectors.groupingBy(Rfid::getCommodity, Collectors.counting()));

        long nextStockId = inventoryRepo.findAll().stream()
                .map(Inventory::getStockId)
                .max(Long::compare)
                .orElse(0L) + 1;

        List<Inventory> allInventories = inventoryRepo.findAll();
        Set<String> existingCommodities = allInventories.stream()
                .map(Inventory::getCommodity)
                .collect(Collectors.toSet());

        for (Inventory inventory : allInventories) {
            String commodity = inventory.getCommodity();
            int stockLevel = commodityCounts.getOrDefault(commodity, 0L).intValue();

            if (stockLevel == 0) {
                inventoryRepo.delete(inventory);
            } else {
                inventory.setStockLevel(stockLevel);
                inventoryRepo.save(inventory);
            }
        }

        for (Map.Entry<String, Long> entry : commodityCounts.entrySet()) {
            String commodity = entry.getKey();
            int stockLevel = entry.getValue().intValue();

            if (!existingCommodities.contains(commodity)) {
                Inventory newInventory = new Inventory();
                newInventory.setCommodity(commodity);
                newInventory.setStockLevel(stockLevel);
                newInventory.setStockId(nextStockId++);
                inventoryRepo.save(newInventory);
            }
        }

        return inventoryRepo.findAll();
    }

    @Override
    public List<Inventory> getInventory() {
        return inventoryRepo.findAll(Sort.by(Sort.Direction.ASC, "_id"));
    }
}
