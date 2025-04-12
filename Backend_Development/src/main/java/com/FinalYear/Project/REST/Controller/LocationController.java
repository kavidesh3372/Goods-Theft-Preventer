package com.FinalYear.Project.REST.Controller;



import com.FinalYear.Project.Entity.Location;
import com.FinalYear.Project.REST.Service.LocationService;
import com.FinalYear.Project.Repository.LocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/FinalYearProject/Gps")
@CrossOrigin("*")
public class LocationController {
    @Autowired
    public LocationService locationService;
    @Autowired
    public LocationRepo locationRepo;
    @GetMapping
    public List<Location> getAllLocation(){
        return locationService.getAllLocation();
    }

    @PostMapping("/GpsData")
    public void addLocationDetails(@RequestBody Location location){
        locationService.addLocation(location);
    }

    @GetMapping("/track/{vanId}")
    public ResponseEntity<Location> getVehicleLocation(@PathVariable String vanId) {
        Optional<Location> location = Optional.ofNullable(locationRepo.findByVanId(vanId));
        return location.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
