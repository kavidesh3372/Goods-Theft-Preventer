package com.FinalYear.Project.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "Tag")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Rfid {
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    @JsonProperty("uid")
    private String uId;
    private String commodity;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime manufacturingDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiringDate;
    private String status;
    private String destination;

}
