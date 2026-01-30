package com.example.Recycling_service.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "recycling_records")
public class RecyclingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer recordId;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "recycler_id", nullable = false)
    private Integer recyclerId;

    @Column(name = "delivered_at")
    private LocalDateTime deliverdAt;

    @Column(name = "received_at")
    private LocalDateTime recievedAt;

    @Column(name = "decomposed_at")
    private LocalDateTime decomposedAt;

    @Column(name = "status", nullable = false)
    private String status;
}
