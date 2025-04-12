package com.FinalYear.Project.REST.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class TransactionRequest {
    private String shopId;
    private List<String> commodities;
    private List<Integer> quantities;
    private int quantity;
    private String destination;
    private String vanId;
}
