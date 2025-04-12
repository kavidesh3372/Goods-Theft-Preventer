package com.FinalYear.Project.REST.Service;
import com.FinalYear.Project.Entity.Goods;
import com.FinalYear.Project.Model.GoodsValue;
import com.FinalYear.Project.Repository.GoodsRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoodsServiceImp implements GoodsService{
    @Autowired
    private GoodsRepo goodsRepo;
    public void addGoods(GoodsValue goodsValue){
        toValue(goodsRepo.save(toEntity(goodsValue)));
    }

    public List<GoodsValue> getAllGoods(){
        List<Goods> goodsList= goodsRepo.findAll(Sort.by(Sort.Direction.ASC, "_id"));
        return goodsList.stream().map(this::toValue).collect(Collectors.toList());
    }

    Goods toEntity(GoodsValue goodsValue) {
        Goods goods = new Goods();
        if (goodsValue.getId() != null) {
            goods.setId(new ObjectId(String.valueOf(goodsValue.getId())));
        }
        goods.setShopId(goodsValue.getShopId());
        goods.setStatus(goodsValue.getStatus());
        goods.setStockLevel(goodsValue.getStockLevel());
        goods.setDestination(goodsValue.getDestination());
        return goods;
    }
    GoodsValue toValue(Goods goods) {
        GoodsValue goodsValue = new GoodsValue();
        goodsValue.setId(goods.getId());
        goodsValue.setShopId(goods.getShopId());
        goodsValue.setStatus(goods.getStatus());
        goodsValue.setStockLevel(goods.getStockLevel());
        goodsValue.setDestination(goods.getDestination());
        return goodsValue;
    }
}
