package com.example.Recycling_service.Repository;

import com.example.Recycling_service.Entity.RecyclingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecyclingRecordRepository extends JpaRepository<RecyclingRecord, Integer> {
    Optional<RecyclingRecord> findByRequestId(Integer requestId);
}

