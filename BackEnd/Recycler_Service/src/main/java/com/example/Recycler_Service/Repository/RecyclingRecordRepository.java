package com.example.Recycler_Service.Repository;

import com.example.Recycler_Service.Entity.RecyclingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecyclingRecordRepository extends JpaRepository<RecyclingRecord, Integer> {
    List<RecyclingRecord> findByRequestId(Integer requestId);

    List<RecyclingRecord> findByRecyclerId(String recyclerId);
}