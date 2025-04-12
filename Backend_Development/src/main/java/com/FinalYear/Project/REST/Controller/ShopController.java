package com.FinalYear.Project.REST.Controller;

import com.FinalYear.Project.Entity.Shop;
import com.FinalYear.Project.REST.Service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Optional;

@RestController
@RequestMapping("/FinalYearProject/Shop")
@CrossOrigin("*")
public class ShopController {
    @Autowired
    private ShopService shopService;

    @PostMapping("/add")
    public ResponseEntity<String> addShop(@RequestBody Shop shop) {
        shopService.addShop(shop);
        return ResponseEntity.ok("Shop added successfully with shopId: " + shop.getShopId());
    }

    @GetMapping("/{shopId}")
    public ResponseEntity<Shop> getShop(@PathVariable String shopId) {
        Optional<Shop> shop = shopService.getShop(shopId);
        return shop.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
