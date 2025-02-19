package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Model.GoodsValue;

import java.util.List;

public interface GoodsService {
    GoodsValue addGoods(GoodsValue goods);
    List<GoodsValue> getAllGoods();
}
