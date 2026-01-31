package com.example.Recycler_Service.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disposal_certificates")
public class DisposalCertificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id")
    private Integer certificate_id;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "recycler_id", nullable = false)
    private String  recyclerId;

    @Column(name = "certificate_number")
    private String certificateNumber;

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;

    public void setRequestId(Integer requestId) { this.requestId = requestId; }
    public Integer getRequestId() { return requestId; }
    public void setRecyclerId(String recyclerId) { this.recyclerId = recyclerId; }
    public String getRecyclerId() { return recyclerId; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public String getCertificateNumber() { return certificateNumber; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
    public LocalDateTime getIssuedAt() { return issuedAt; }
}
