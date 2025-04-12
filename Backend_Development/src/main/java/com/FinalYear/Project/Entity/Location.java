package com.FinalYear.Project.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "GPS")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private String vanId;
    private String shopId;
    private int count;
    private int trackingCount;
    private double longitude;
    private double latitude;
    private double sourceLatitude;
    private double sourceLongitude;
    private double destinationLatitude;
    private double destinationLongitude;


}
