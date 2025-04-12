package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.Location;
import com.FinalYear.Project.Repository.LocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class HttpThingSpeakService {

    private static final String API_URL = "https://api.thingspeak.com/channels/2895782/feeds.json?api_key=5549ZYUCQV5RQ0EY&results=1";

    @Autowired
    private LocationRepo locationRepo;

    public void fetchDataAndUpdateLocation() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String jsonResponse = restTemplate.getForObject(API_URL, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode latestEntry = rootNode.get("feeds").get(0);

            double latitude = latestEntry.has("field1") ? latestEntry.get("field1").asDouble() : 0.0;
            double longitude = latestEntry.has("field2") ? latestEntry.get("field2").asDouble() : 0.0;
            int count = latestEntry.has("field3") ? latestEntry.get("field3").asInt() : 0;
            String vanId = "TN63AD2021";

            updateLocation(vanId, latitude, longitude,count);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void updateLocation(String vanId, double latitude, double longitude,int count) {
        Location location = locationRepo.findByVanId(vanId);
        if (location == null) {
            location = new Location();
            location.setVanId(vanId);
        }
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setTrackingCount(count);
        locationRepo.save(location);
        System.out.println("Updated location for Van " + vanId + ": " + latitude + ", " + longitude);
    }
//    @Scheduled(fixedRate = 10000)
//    public void fetchDataAutomatically() {
//        System.out.println("Fetching data automatically...");
//        fetchDataAndUpdateLocation();
//    }
}
