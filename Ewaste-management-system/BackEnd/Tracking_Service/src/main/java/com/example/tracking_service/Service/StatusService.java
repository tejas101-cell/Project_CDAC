package com.example.tracking_service.Service;

import com.example.tracking_service.TrackingDTO.CreateStatusRequestLogDTO;
import com.example.tracking_service.TrackingDTO.CreateStatusResponseLogDTO;

import java.util.List;

public interface StatusService {
    // log a status
    void logStatus(CreateStatusRequestLogDTO requestDTO);
    List<CreateStatusResponseLogDTO> getTrackingHistory(Integer requestId);
}
