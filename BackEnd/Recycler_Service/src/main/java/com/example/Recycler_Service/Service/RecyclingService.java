package com.example.Recycler_Service.Service;

import com.example.Recycler_Service.RecyclingDTO.RecyclingDTO;
import com.example.Recycler_Service.RecyclingDTO.DisposalCertificateDTO;

public interface RecyclingService {
    void markDelivered(Integer requestId, String collectorId, String recyclerId);
    void markReceived(Integer requestId);
    void markDecomposed(Integer requestId);
    com.example.Recycler_Service.Entity.DisposalCertificate getOrCreateCertificate(Integer requestId);
    void processWaste(RecyclingDTO dto);
    void generateDisposalCertificate(DisposalCertificateDTO dto);
}
