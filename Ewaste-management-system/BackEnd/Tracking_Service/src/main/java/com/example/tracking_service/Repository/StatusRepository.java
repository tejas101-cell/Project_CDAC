package com.example.tracking_service.Repository;

import com.example.tracking_service.Entity.StatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusRepository extends JpaRepository<StatusLog, Integer> {
    List<StatusLog> findByRequestIdOrderByUpdatedOn(Integer requestId);
}
