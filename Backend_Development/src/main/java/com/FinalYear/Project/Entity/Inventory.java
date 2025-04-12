package com.FinalYear.Project.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "Inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private Long stockId;
    private String commodity;
    private Integer stockLevel;
}
