package com.FinalYear.Project.REST.Controller;


import com.FinalYear.Project.Model.GoodsValue;
import com.FinalYear.Project.REST.Service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
public class GoodsController {
    @Autowired
    public GoodsService goodsService;
    @GetMapping
    public List<GoodsValue> getAllGoods() {
        return goodsService.getAllGoods();
    }
    @PostMapping("/addGoods")
    public void addGoodsDetails(@RequestBody GoodsValue goods) {
        goodsService.addGoods(goods);
    }
}