package com.example.Recycler_Service.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_logs")
public class DeliveryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Integer deliveryId;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "collector_id", nullable = false)
    private String collectorId;

    @Column(name = "recycler_id", nullable = false)
    private String recyclerId;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "status", nullable = false)
    private String status;

    public void setRequestId(Integer requestId) { this.requestId = requestId; }
    public Integer getRequestId() { return requestId; }
    public void setCollectorId(String collectorId) { this.collectorId = collectorId; }
    public String getCollectorId() { return collectorId; }
    public void setRecyclerId(String recyclerId) { this.recyclerId = recyclerId; }
    public String getRecyclerId() { return recyclerId; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setStatus(String status) { this.status = status; }
    public String getStatus() { return status; }
}
