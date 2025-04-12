package com.FinalYear.Project.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Goods")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Goods {

    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private String shopId;
    private String status;
    private Integer stockLevel;
    private String destination;
}

