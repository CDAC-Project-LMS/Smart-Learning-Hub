import axiosClient from "./axiosClient";

export const enrollmentApi = {

    enroll: (courseId) =>
        axiosClient.post(`/api/student/courses/${courseId}/enroll`),

    getMine: (page = 0, size = 20) =>
        axiosClient.get("/api/student/enrollments", {
            params: { page, size }
        }),

    getDetails: (courseId) =>
        axiosClient.get(`/api/student/courses/${courseId}/enrollment`)
};