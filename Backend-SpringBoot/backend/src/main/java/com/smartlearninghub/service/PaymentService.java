package com.smartlearninghub.service;

import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.payment.PaymentRequest;
import com.smartlearninghub.dto.payment.PaymentResponse;

public interface PaymentService {

    PaymentResponse processPayment(String studentEmail, PaymentRequest request);

    PageResponse<PaymentResponse> getMyPayments(String studentEmail, int page, int size);

    PageResponse<PaymentResponse> getAllPayments(int page, int size);
}
