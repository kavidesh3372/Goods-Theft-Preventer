package com.FinalYear.Project.REST.Service;

import com.FinalYear.Project.Entity.Location;

import java.util.List;

public interface LocationService {
    void addLocation(Location location);

    List<Location> getAllLocation();


}
