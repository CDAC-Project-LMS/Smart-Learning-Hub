package com.smartlearninghub.serviceImpl;

import com.smartlearninghub.dto.ApiResponse;
import com.smartlearninghub.dto.auth.*;
import com.smartlearninghub.entity.User;
import com.smartlearninghub.exception.BadRequestException;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.exception.UnauthorizedException;
import com.smartlearninghub.repository.UserRepository;
import com.smartlearninghub.security.CustomUserDetails;
import com.smartlearninghub.security.JwtUtil;
import com.smartlearninghub.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    //private final JavaMailSender mailSender;

    @Value("${app.frontend.reset-password-url}")
    private String resetPasswordUrl;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .isActive(true)
                .build();

        User saved = userRepository.save(user);
        log.info("New user registered: {} ({})", saved.getEmail(), saved.getRole());

        CustomUserDetails userDetails = new CustomUserDetails(saved);
        String token = jwtUtil.generateToken(userDetails, saved.getId(), saved.getRole().name());

        return AuthResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .token(token)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException("This account has been deactivated. Please contact support.");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        log.info("User logged in: {}", user.getEmail());

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    /*@Override
    @Transactional
    public ApiResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetLink = resetPasswordUrl + "?token=" + token;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Smart Learning Hub - Password Reset Request");
            message.setText("Hello " + user.getName() + ",\n\n"
                    + "We received a request to reset your password. Click the link below to set a new one. "
                    + "This link will expire in 1 hour.\n\n"
                    + resetLink + "\n\n"
                    + "If you did not request this, please ignore this email.\n\n"
                    + "- Smart Learning Hub Team");
            mailSender.send(message);
            log.info("Password reset email sent to {}", user.getEmail());
        } catch (Exception ex) {
            // Do not fail the request just because mail delivery failed (e.g. missing SMTP config in dev).
            log.error("Failed to send password reset email to {}: {}", user.getEmail(), ex.getMessage());
        }

        return ApiResponse.of(true, "If an account exists with this email, a password reset link has been sent.");
    }*/
   /*@Override
@Transactional
public ApiResponse forgotPassword(ForgotPasswordRequest request) {

    User user = userRepository.findByEmail(request.getEmail().toLowerCase())
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

    // Generate reset token
    String token = UUID.randomUUID().toString();

    user.setResetToken(token);
    user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));

    userRepository.save(user);

    // Create reset link
    String resetLink = resetPasswordUrl + "?token=" + token;

    // Print reset link in console (No Email Required)
    System.out.println("\n=================================================");
    System.out.println(" SMART LEARNING HUB - PASSWORD RESET ");
    System.out.println("=================================================");
    System.out.println("User : " + user.getEmail());
    System.out.println("Reset Link:");
    System.out.println(resetLink);
    System.out.println("=================================================\n");

    log.info("Password Reset Link: {}", resetLink);

    return ApiResponse.of(true,
            "Password reset link generated successfully. Check the backend console.");
}*/
/*@Override
@Transactional
public ApiResponse forgotPassword(ForgotPasswordRequest request) {

    User user = userRepository.findByEmail(request.getEmail().toLowerCase())
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

    String token = UUID.randomUUID().toString();

    user.setResetToken(token);
    user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
    userRepository.save(user);

    return new ApiResponse(
            true,
            "Password reset token generated successfully.",
            token
    );
}*/
@Override
@Transactional
public ApiResponse forgotPassword(ForgotPasswordRequest request) {

    // Find user by email
    User user = userRepository.findByEmail(request.getEmail().toLowerCase())
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

    // Generate reset token
    String token = UUID.randomUUID().toString();

    // Save token and expiry
    user.setResetToken(token);
    user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
    userRepository.save(user);

    // Create reset link
    String resetLink = resetPasswordUrl + "?token=" + token;

    log.info("Password reset link generated for {} : {}", user.getEmail(), resetLink);

    // Return reset link to frontend
    return ApiResponse.of(
            true,
            "Password reset link generated successfully.",
            resetLink
    );
}

    @Override
    @Transactional
    public ApiResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This reset token has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        log.info("Password reset successfully for {}", user.getEmail());
        return ApiResponse.of(true, "Password has been reset successfully. You can now log in.");
    }

    @Override
    @Transactional
    public ApiResponse changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed for {}", user.getEmail());
        return ApiResponse.of(true, "Password changed successfully");
    }
}
