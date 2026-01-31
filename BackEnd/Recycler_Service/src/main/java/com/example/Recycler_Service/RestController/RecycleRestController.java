package com.example.Recycler_Service.RestController;

import com.example.Recycler_Service.Entity.DeliveryLog;
import com.example.Recycler_Service.Entity.DisposalCertificate;
import com.example.Recycler_Service.Entity.RecyclingRecord;
import com.example.Recycler_Service.Repository.DisposalCertificateRepository;
import java.util.Optional;
import com.example.Recycler_Service.RecyclingDTO.DeliveryDTO;
import com.example.Recycler_Service.Repository.DeliveryLogRepository;
import com.example.Recycler_Service.Repository.RecyclingRecordRepository;
import com.example.Recycler_Service.Service.RecyclingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recycle") 
@RequiredArgsConstructor
public class RecycleRestController {

    private final RecyclingService recyclingService;
    private final DeliveryLogRepository deliveryLogRepo;
    private final RecyclingRecordRepository recycleRepo;
    private final DisposalCertificateRepository certificateRepo;

    @PostMapping("/deliver")
    public ResponseEntity<String> markedDelivered(@RequestBody DeliveryDTO dto) {
        recyclingService.markDelivered(dto.getRequestId(), dto.getCollectorId(), dto.getRecyclerId());
        return ResponseEntity.ok("Handover complete");
    }

    @PostMapping("/receive/{requestId}")
    public ResponseEntity<String> markedReceived(@PathVariable Integer requestId) {
        recyclingService.markReceived(requestId);
        return ResponseEntity.ok("Item received by recycler");
    }

    @GetMapping("/pending/{recyclerId}")
    public List<DeliveryLog> getPending(@PathVariable String recyclerId) {
        return deliveryLogRepo.findByRecyclerIdAndStatus(recyclerId, "Delivered");
    }

    @GetMapping("/inventory/{recyclerId}")
    public List<RecyclingRecord> getInventory(@PathVariable String recyclerId) {
        return recycleRepo.findByRecyclerId(recyclerId);
    }

    @PostMapping("/decompose/{requestId}")
    public ResponseEntity<String> markedDecomposed(@PathVariable Integer requestId) {
        recyclingService.markDecomposed(requestId);
        return ResponseEntity.ok("Disposal certificate issued");
    }

    @GetMapping("/certificate/{requestId}")
    public ResponseEntity<DisposalCertificate> getCertificate(@PathVariable Integer requestId) {
        DisposalCertificate cert = recyclingService.getOrCreateCertificate(requestId);
        if (cert != null) {
            return ResponseEntity.ok(cert);
        }
        return ResponseEntity.notFound().build();
    }
}