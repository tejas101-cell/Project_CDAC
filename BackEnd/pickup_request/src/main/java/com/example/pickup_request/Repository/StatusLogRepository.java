package com.example.pickup_request.Repository;

import com.example.pickup_request.Entity.StatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusLogRepository extends JpaRepository<StatusLog, Integer> {
    List<StatusLog> findByRequestId(Integer requestId);
}
