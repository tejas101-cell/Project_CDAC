package com.example.Recycling_service.Serivce;

public interface RecyclingService {
    void markDelivered(Integer requestId, Integer collectorId, Integer recyclerId);
    void markReceived(Integer requestId);
    void markDecomposed(Integer requestId);
}
