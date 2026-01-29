package com.example.pickup_request.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "pickup_requests")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PickupRequests {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "request_date")
    private LocalDateTime requestDate;

    @Column(name = "pickup_date")
    private LocalDate pickupDate;

    @Column(name = "pickup_address", nullable = false)
    private String pickupAddress;

    @Column(name = "status")
    private String status;
}
