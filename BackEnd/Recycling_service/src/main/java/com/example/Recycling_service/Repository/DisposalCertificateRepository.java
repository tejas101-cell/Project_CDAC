package com.example.Recycling_service.Repository;

import com.example.Recycling_service.Entity.DisposalCertiicate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisposalCertificateRepository extends JpaRepository<DisposalCertiicate, Integer> {

}
