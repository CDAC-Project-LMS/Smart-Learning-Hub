package com.smartlearninghub.service;

import com.smartlearninghub.dto.ApiResponse;
import com.smartlearninghub.dto.auth.*;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    ApiResponse forgotPassword(ForgotPasswordRequest request);

    ApiResponse resetPassword(ResetPasswordRequest request);

    ApiResponse changePassword(String email, ChangePasswordRequest request);
}
