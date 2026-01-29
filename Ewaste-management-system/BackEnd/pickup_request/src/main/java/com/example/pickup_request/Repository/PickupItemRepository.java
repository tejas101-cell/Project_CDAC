package com.example.pickup_request.Repository;

import com.example.pickup_request.Entity.PickupItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickupItemRepository extends JpaRepository<PickupItem, Integer> {
    List<PickupItem> findByRequestId(Integer requestId);
}
