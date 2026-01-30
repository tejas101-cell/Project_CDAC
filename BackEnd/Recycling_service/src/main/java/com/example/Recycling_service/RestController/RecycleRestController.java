package com.example.Recycling_service.RestController;

import com.example.Recycling_service.RecyclingDTO.DeliveryDTO;
import com.example.Recycling_service.Serivce.RecyclingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recycle")
@RequiredArgsConstructor
public class RecycleRestController {
    private final RecyclingService recyclingService;

    @PostMapping("/deliver")
    public ResponseEntity<String> markedDelivered(@RequestBody DeliveryDTO deliveryDTO){
        recyclingService.markDelivered(
                deliveryDTO.getRequestId(),
                deliveryDTO.getCollectorId(),
                deliveryDTO.getRecyclerId()
        );
        return ResponseEntity.ok("Delivered successfully");
    }

    @PostMapping("/receive/{requestId}")
    public ResponseEntity<String> markedRecieved(@PathVariable("requestId") Integer requestId){
        recyclingService.markReceived(requestId);
        return ResponseEntity.ok("Received the item successfully");
    }

    @PostMapping("/decompose/{requestId}")
    public ResponseEntity<String> markedDecomposed(@PathVariable("requestId") Integer requestId){
        recyclingService.markDecomposed(requestId);
        return ResponseEntity.ok("Decomposed the item successfully");
    }
}
