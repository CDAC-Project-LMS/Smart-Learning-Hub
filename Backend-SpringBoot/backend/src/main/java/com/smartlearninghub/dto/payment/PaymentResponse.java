package com.smartlearninghub.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private BigDecimal amount;
    private String paymentStatus;
    private LocalDateTime paymentDate;
}
