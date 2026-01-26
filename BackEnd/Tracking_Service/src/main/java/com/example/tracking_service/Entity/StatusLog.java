package com.example.tracking_service.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "status_logs")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatusLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer logId;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "updated_by", nullable = false)
    private int updatedBy;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;
}
