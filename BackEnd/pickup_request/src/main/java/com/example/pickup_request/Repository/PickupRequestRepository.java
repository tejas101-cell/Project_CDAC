package com.example.pickup_request.Repository;

import com.example.pickup_request.Entity.PickupRequests;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickupRequestRepository extends JpaRepository<PickupRequests, Integer> {

}
