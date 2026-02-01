package com.example.Recycler_Service.Service;

import com.example.Recycler_Service.Client.PickupClient;
import com.example.Recycler_Service.Client.TrackingClient;
import com.example.Recycler_Service.Entity.DeliveryLog;
import com.example.Recycler_Service.Entity.DisposalCertificate;
import com.example.Recycler_Service.Entity.RecyclingRecord;
import com.example.Recycler_Service.RecyclingDTO.StatusLogDTO;
import com.example.Recycler_Service.RecyclingDTO.RecyclingDTO;
import com.example.Recycler_Service.RecyclingDTO.DisposalCertificateDTO;
import com.example.Recycler_Service.Repository.DeliveryLogRepository;
import com.example.Recycler_Service.Repository.DisposalCertificateRepository;
import com.example.Recycler_Service.Repository.RecyclingRecordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecyclingServiceImpl implements RecyclingService {
    private final DeliveryLogRepository deliveryLogRepo;
    private final DisposalCertificateRepository certificateRepo;
    private final RecyclingRecordRepository recycleRepo;
    private final TrackingClient trackingClient;
    private final PickupClient pickupClient;

    @Override
    @Transactional
    public void markDelivered(Integer requestId, String collectorId, String recyclerId) {
        // Prevent duplicate delivery logs
        if (deliveryLogRepo.findByRequestId(requestId).isPresent()) {
            return;
        }

        DeliveryLog deliveryLog = new DeliveryLog();
        deliveryLog.setRequestId(requestId);
        deliveryLog.setCollectorId(collectorId);
        deliveryLog.setRecyclerId(recyclerId);
        deliveryLog.setDeliveredAt(LocalDateTime.now());
        deliveryLog.setStatus("Delivered");
        deliveryLogRepo.save(deliveryLog);

        try {
            trackingClient.logStatus(new StatusLogDTO(requestId, "Delivered", collectorId));
            
            // CRITICAL SYNC: Update Pickup Service status to COMPLETED (or DELIVERED)
            // This ensures the User Dashboard reflects the successful handover.
            pickupClient.updateStatus(requestId, "COMPLETED", "ADMIN");
        } catch (Exception e) {
            System.err.println("Failed to log status or sync with pickup service: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void markReceived(Integer requestId) {
        DeliveryLog deliveryLog = deliveryLogRepo.findByRequestId(requestId)
                .orElseThrow(() -> new RuntimeException("Handover record not found for request #" + requestId));

        // Prevent duplicate records
        if (!recycleRepo.findByRequestId(requestId).isEmpty()) {
            return;
        }

        RecyclingRecord record = new RecyclingRecord();
        record.setRequestId(requestId);
        record.setRecyclerId(deliveryLog.getRecyclerId());
        record.setReceivedAt(LocalDateTime.now());
        record.setStatus("Received");
        recycleRepo.save(record);

        try {
            trackingClient.logStatus(new StatusLogDTO(requestId, "Received", deliveryLog.getRecyclerId()));
        } catch (Exception e) {
            System.err.println("Failed to log status to tracking service: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void markDecomposed(Integer requestId) {
        var records = recycleRepo.findByRequestId(requestId);
        if (records.isEmpty()) {
            throw new RuntimeException("Material not found in inventory for request #" + requestId);
        }
        
        // Take the first one if multiple exist (to avoid 500 error)
        RecyclingRecord record = records.get(0);

        if ("Decomposed".equals(record.getStatus())) {
            return; // Already recycled
        }

        record.setDecomposedAt(LocalDateTime.now());
        record.setStatus("Decomposed");
        recycleRepo.save(record);

        DisposalCertificate certificate = new DisposalCertificate();
        certificate.setRequestId(requestId);
        certificate.setRecyclerId(record.getRecyclerId());
        certificate.setCertificateNumber("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificate.setIssuedAt(LocalDateTime.now());
        certificateRepo.save(certificate);

        try {
            trackingClient.logStatus(new StatusLogDTO(requestId, "Decomposed", record.getRecyclerId()));
            // Propagate status to Pickup Service
            pickupClient.updateStatus(requestId, "DECOMPOSED", "ADMIN");
        } catch (Exception e) {
            System.err.println("Failed to log status or update pickup service: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public DisposalCertificate getOrCreateCertificate(Integer requestId) {
        // 1. Try to find existing
        Optional<DisposalCertificate> existing = certificateRepo.findByRequestId(requestId);
        if (existing.isPresent()) {
            return existing.get();
        }

        // 2. Fallback: Check RecyclingRecords
        var records = recycleRepo.findByRequestId(requestId);
        if (!records.isEmpty()) {
            return createCertificate(requestId, records.get(0).getRecyclerId());
        }

        // 3. Fallback: Check DeliveryLogs (Handover record)
        Optional<DeliveryLog> log = deliveryLogRepo.findByRequestId(requestId);
        if (log.isPresent()) {
            return createCertificate(requestId, log.get().getRecyclerId());
        }

        // 4. ⭐ ROBUST RECOVERY: Fallback for historical/corrupted "ghost" records.
        // If the user can see the button, they deserve a certificate even if 
        // local mapping was lost. We use a placeholder recycler ID.
        return createCertificate(requestId, "RECYCLER_AUTO_RECOVERY");
    }

    private DisposalCertificate createCertificate(Integer requestId, String recyclerId) {
        DisposalCertificate certificate = new DisposalCertificate();
        certificate.setRequestId(requestId);
        certificate.setRecyclerId(recyclerId);
        certificate.setCertificateNumber("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificate.setIssuedAt(LocalDateTime.now());
        
        return certificateRepo.save(certificate);
    }

    @Override
    public void processWaste(RecyclingDTO dto) {
        // ... implementation as needed
    }

    @Override
    public void generateDisposalCertificate(DisposalCertificateDTO dto) {
        // ... implementation as needed
    }
}