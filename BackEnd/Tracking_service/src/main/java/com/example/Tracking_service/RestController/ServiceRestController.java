package com.example.Tracking_service.RestController;

import com.example.Tracking_service.Service.StatusService;
import com.example.Tracking_service.TrackingDTO.CreateStatusRequestLogDTO;
import com.example.Tracking_service.TrackingDTO.CreateStatusResponseLogDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("tracking")
@RequiredArgsConstructor
public class ServiceRestController {
    private final StatusService statusService;

    @PostMapping("/status")
    public ResponseEntity<String> loggedStatus(@RequestBody CreateStatusRequestLogDTO statusReq){
        statusService.logStatus(statusReq);
        return  ResponseEntity.ok("Status logged successfully");
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<List<CreateStatusResponseLogDTO>> gotTrackingHistory(@PathVariable("id") Integer requestId){
        return ResponseEntity.ok(statusService.getTrackingHistory(requestId));
    }
}
