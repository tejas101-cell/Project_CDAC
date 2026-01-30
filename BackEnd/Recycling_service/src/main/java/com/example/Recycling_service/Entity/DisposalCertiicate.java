package com.example.Recycling_service.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "disposal_certificates")
public class DisposalCertiicate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id")
    private Integer certificate_id;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "recycler_id", nullable = false)
    private Integer recyclerId;

    @Column(name = "certificate_number")
    private String certificateNumber;

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;
}
