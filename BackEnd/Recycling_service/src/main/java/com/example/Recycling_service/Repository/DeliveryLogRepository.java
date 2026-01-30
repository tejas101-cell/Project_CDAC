package com.example.Recycling_service.Repository;

import com.example.Recycling_service.Entity.DeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryLogRepository extends JpaRepository<DeliveryLog, Integer> {
    Optional<DeliveryLog> findByRequestId(Integer requestId);
}
