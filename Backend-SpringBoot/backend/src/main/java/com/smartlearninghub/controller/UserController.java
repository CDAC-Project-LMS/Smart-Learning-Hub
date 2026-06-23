package com.smartlearninghub.controller;

import com.smartlearninghub.dto.user.UpdateProfileRequest;
import com.smartlearninghub.dto.user.UserResponse;
import com.smartlearninghub.entity.User;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

/**
 * Profile endpoints shared by every authenticated role (Student, Instructor, Admin).
 */
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "View and update the current user's profile")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get the current authenticated user's profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authentication.getName()));
        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping
    @Transactional
    @Operation(summary = "Update the current authenticated user's name/phone")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request,
                                                        Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authentication.getName()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        User saved = userRepository.save(user);
        return ResponseEntity.ok(toResponse(saved));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
