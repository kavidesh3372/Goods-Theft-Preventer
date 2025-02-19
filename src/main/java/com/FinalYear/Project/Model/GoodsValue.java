package com.FinalYear.Project.Model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;

import java.io.Serializable;
import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class GoodsValue implements Serializable {
    @JsonProperty("_id")
    private ObjectId id;
    private String shopId;
    private String status;
    private Integer item;
    private String destination;
    public GoodsValue(String shopId,String status,Integer item,String destination){
        this.shopId=shopId;
        this.status=status;
        this.item=item;
        this.destination=destination;
    }

}
