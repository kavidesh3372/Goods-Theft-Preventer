package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.Location;
import com.FinalYear.Project.Entity.Shop;
import com.FinalYear.Project.Repository.LocationRepo;
import com.FinalYear.Project.Repository.ShopRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationServiceImp implements LocationService {
    @Autowired
    private LocationRepo locationRepo;
    @Autowired
    private ShopRepo shopRepo;

    public void addLocation(Location location) {
        locationRepo.save(location);
    }

    public List<Location> getAllLocation() {

        return locationRepo.findAll(Sort.by(Sort.Direction.ASC, "_id"));
    }


}
