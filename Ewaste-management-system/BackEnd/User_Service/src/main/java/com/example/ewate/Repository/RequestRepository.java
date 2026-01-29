package com.example.ewate.Repository;

import com.example.ewate.Entity.EwasteRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<EwasteRequest, Long> {
    List<EwasteRequest> findByUser_UserId(Integer userId);
    List<EwasteRequest> findByCollector_UserId(Integer collectorId);
}
