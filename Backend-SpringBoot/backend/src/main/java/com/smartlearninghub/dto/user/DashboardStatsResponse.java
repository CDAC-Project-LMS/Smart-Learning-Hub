package com.smartlearninghub.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalStudents;
    private long totalInstructors;
    private long totalCourses;
    private long totalEnrollments;
    private long totalCertificatesIssued;
    private BigDecimal totalRevenue;
}
