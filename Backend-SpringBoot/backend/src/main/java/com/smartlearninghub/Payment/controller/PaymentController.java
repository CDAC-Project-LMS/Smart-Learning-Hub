package com.smartlearninghub.Payment.controller;

import com.smartlearninghub.dto.payment.PaymentRequest;
import com.smartlearninghub.Payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-checkout-session")
    public String checkout(@RequestBody PaymentRequest request) throws Exception {

        return paymentService.createCheckoutSession(request);

        
    }

}
