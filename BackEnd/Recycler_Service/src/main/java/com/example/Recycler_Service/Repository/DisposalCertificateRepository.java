package com.example.Recycler_Service.Repository;

import com.example.Recycler_Service.Entity.DisposalCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DisposalCertificateRepository extends JpaRepository<DisposalCertificate, Integer> {
    Optional<DisposalCertificate> findByRequestId(Integer requestId);
}