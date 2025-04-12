package com.FinalYear.Project.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;

@Document(collection = "Shop")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Shop {
    @Id
    @JsonProperty("_id") // Ensure ObjectId is mapped correctly
    private String id;

    @JsonProperty("shopId")
    private String shopId;

    // Prevents null values
    private Double latitude;
    private Double longitude;
}
