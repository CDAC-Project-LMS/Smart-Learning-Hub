package com.smartlearninghub.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    private Long courseId;

    private String courseName;

    // Amount in paise (₹100 = 10000)
    private Long amount;
}