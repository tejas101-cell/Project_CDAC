package com.example.Recycler_Service.Repository;
import com.example.Recycler_Service.Entity.DeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DeliveryLogRepository extends JpaRepository<DeliveryLog, Integer> {
    Optional<DeliveryLog> findByRequestId(Integer requestId);
    
    List<DeliveryLog> findByRecyclerIdAndStatus(String recyclerId, String status);
}