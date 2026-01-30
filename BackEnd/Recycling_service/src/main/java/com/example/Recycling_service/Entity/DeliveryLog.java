package com.example.Recycling_service.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "delivery_logs")
public class DeliveryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Integer deliveryId;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "collector_id", nullable = false)
    private Integer collectorId;

    @Column(name = "recycler_id", nullable = false)
    private Integer recyclerId;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "status", nullable = false)
    private String status;
}
