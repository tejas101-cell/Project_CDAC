package com.example.Tracking_service.Service;

import com.example.Tracking_service.TrackingDTO.CreateStatusRequestLogDTO;
import com.example.Tracking_service.TrackingDTO.CreateStatusResponseLogDTO;

import java.util.List;

public interface StatusService {
    // log a status
    void logStatus(CreateStatusRequestLogDTO requestDTO);
    List<CreateStatusResponseLogDTO> getTrackingHistory(Integer requestId);
}
