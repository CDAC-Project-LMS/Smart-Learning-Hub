package com.smartlearninghub.repository;

import com.smartlearninghub.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findByStudentId(Long studentId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
    BigDecimal sumSuccessfulPayments();
}
