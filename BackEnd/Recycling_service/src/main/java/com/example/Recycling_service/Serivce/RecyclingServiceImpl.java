package com.example.Recycling_service.Serivce;

import com.example.Recycling_service.Client.TrackingClient;
import com.example.Recycling_service.Entity.DeliveryLog;
import com.example.Recycling_service.Entity.DisposalCertiicate;
import com.example.Recycling_service.Entity.RecyclingRecord;
import com.example.Recycling_service.RecyclingDTO.StatusLogDTO;
import com.example.Recycling_service.Repository.DeliveryLogRepository;
import com.example.Recycling_service.Repository.DisposalCertificateRepository;
import com.example.Recycling_service.Repository.RecyclingRecordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RecyclingServiceImpl implements RecyclingService{
    private final DeliveryLogRepository deliveryLogRepo;
    private final DisposalCertificateRepository certificate;
    private final RecyclingRecordRepository recycleRepo;
    private final TrackingClient trackingClient;

    @Override
    @Transactional
    public void markDelivered(Integer requestId, Integer collectorId, Integer recyclerId) {
        DeliveryLog deliveryLog= DeliveryLog.builder()
                .requestId(requestId)
                .collectorId(collectorId)
                .recyclerId(recyclerId)
                .deliveredAt(LocalDateTime.now())
                .status("Delivered")
                .build();
        // saving the new entity inside the delivery log table
        deliveryLogRepo.save(deliveryLog);

        trackingClient.loggedStatus(new StatusLogDTO(
                requestId,
                "Delivered",
                collectorId
        ));
    }

    @Override
    @Transactional
    public void markReceived(Integer requestId) {
        DeliveryLog deliveryLog = deliveryLogRepo
                .findByRequestId(requestId)
                .orElseThrow(()->new RuntimeException("Request not found"));

        RecyclingRecord record = RecyclingRecord.builder()
                .requestId(requestId)
                .recyclerId(deliveryLog.getRecyclerId())
                .recievedAt(LocalDateTime.now())
                .status("Received")
                .build();

        RecyclingRecord savedRecord = recycleRepo.save(record);

        trackingClient.loggedStatus(new StatusLogDTO(
                requestId,
                "Received",
                savedRecord.getRecyclerId()
        ));
    }

    @Override
    @Transactional
    public void markDecomposed(Integer requestId) {
        // making a record
        RecyclingRecord record = recycleRepo
                .findByRequestId(requestId)
                .orElseThrow(()->new RuntimeException("Not yet received"));

        if (!"Received".equals(record.getStatus())){
            throw new RuntimeException("Waste must be reveived before composition");
        }

        record.setDecomposedAt(LocalDateTime.now());
        record.setStatus("Decomposed");

        // saving a record
        recycleRepo.save(record);

        DisposalCertiicate disposalCertiicate = DisposalCertiicate.builder()
                .requestId(requestId)
                .recyclerId(record.getRecyclerId())
                .certificateNumber(
                        "cert-"+requestId+"-"+System.currentTimeMillis()
                )
                .issuedAt(LocalDateTime.now())
                .build();

        certificate.save(disposalCertiicate);

        trackingClient.loggedStatus(new StatusLogDTO(
                requestId,
                "Decomposed",
                record.getRecyclerId()
        ));
    }
}
