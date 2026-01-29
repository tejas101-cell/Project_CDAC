package com.example.tracking_service.Service;

import com.example.tracking_service.Entity.StatusLog;
import com.example.tracking_service.Repository.StatusRepository;
import com.example.tracking_service.TrackingDTO.CreateStatusRequestLogDTO;
import com.example.tracking_service.TrackingDTO.CreateStatusResponseLogDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatusServiceImpl implements StatusService{
    // statusRepo for cruds
    private final StatusRepository statusRepository;

    @Override
    public void logStatus(CreateStatusRequestLogDTO requestDTO) {
        StatusLog statusLog = StatusLog.builder()
                .requestId(requestDTO.getRequestId())
                .status(requestDTO.getStatus())
                .updatedBy(requestDTO.getUpdatedBy())
                .updatedOn(LocalDateTime.now())
                .build();
        statusRepository.save(statusLog);
    }

    @Override
    public List<CreateStatusResponseLogDTO> getTrackingHistory(Integer requestId) {
        List<CreateStatusResponseLogDTO> logs = statusRepository.findByRequestIdOrderByUpdatedOn(requestId).stream()
                .map(log -> new CreateStatusResponseLogDTO(log.getStatus(), log.getUpdatedOn())).toList();
        return logs;
    }
}
