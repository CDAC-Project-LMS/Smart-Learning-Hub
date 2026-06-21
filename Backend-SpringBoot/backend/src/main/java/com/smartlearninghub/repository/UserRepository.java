package com.smartlearninghub.repository;

import com.smartlearninghub.entity.Role;
import com.smartlearninghub.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    Page<User> findByRole(Role role, Pageable pageable);

    long countByRole(Role role);
}
