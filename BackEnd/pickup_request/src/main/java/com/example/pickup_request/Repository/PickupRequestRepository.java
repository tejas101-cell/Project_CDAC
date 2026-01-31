package com.example.pickup_request.Repository;

import com.example.pickup_request.Entity.PickupRequests;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PickupRequestRepository extends JpaRepository<PickupRequests, Integer> {
    List<PickupRequests> findByUserId(String userId);  
    
    List<PickupRequests> findByCollectorId(String collectorId);
}