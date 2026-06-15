package com.smartlearninghub.Payment.service;

import com.smartlearninghub.dto.payment.PaymentRequest;

public interface PaymentService {

    String createCheckoutSession(PaymentRequest request) throws Exception;

}