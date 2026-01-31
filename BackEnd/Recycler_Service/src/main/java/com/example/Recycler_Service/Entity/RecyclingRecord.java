package com.example.Recycler_Service.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recycling_records")
public class RecyclingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer recordId;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "recycler_id", nullable = false)
    private String  recyclerId;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @Column(name = "decomposed_at")
    private LocalDateTime decomposedAt;

    @Column(name = "status", nullable = false)
    private String status;

    public void setRequestId(Integer requestId) { this.requestId = requestId; }
    public Integer getRequestId() { return requestId; }
    public void setRecyclerId(String recyclerId) { this.recyclerId = recyclerId; }
    public String getRecyclerId() { return recyclerId; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }
    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setDecomposedAt(LocalDateTime decomposedAt) { this.decomposedAt = decomposedAt; }
    public LocalDateTime getDecomposedAt() { return decomposedAt; }
    public void setStatus(String status) { this.status = status; }
    public String getStatus() { return status; }
}
