package com.example.pickup_request.Repository;

import com.example.pickup_request.Entity.PickupRequests;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface PickupRequestRepository extends JpaRepository<PickupRequests, Integer> {
    @Modifying
    @Query("""
            UPDATE PickupRequests p 
            SET p.status = :status
            where p.requestId = :requestId
        """)
    int updateStatus(@Param("requestId") Integer requestId,
                     @Param("status") String status);
}
