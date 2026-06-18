import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { enrollmentApi } from "../api/enrollmentApi";

export default function PaymentSuccess() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const courseId = searchParams.get("courseId");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function enrollStudent() {

            try {

                if (courseId) {

                    await enrollmentApi.enroll(courseId);

                }

            } catch (e) {

                console.log(e);

            } finally {

                setLoading(false);

            }

        }

        enrollStudent();

    }, [courseId]);

    if (loading) {

        return (

            <div className="container text-center mt-5">

                <div className="spinner-border text-primary"></div>

                <h4 className="mt-3">
                    Completing your enrollment...
                </h4>

            </div>

        );

    }

    return (

        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >

            <div
                className="card shadow-lg p-5 text-center"
                style={{ maxWidth: "550px", width: "100%" }}
            >

                <i
                    className="bi bi-check-circle-fill text-success"
                    style={{ fontSize: "80px" }}
                ></i>

                <h2 className="text-success mt-3">
                    Payment Successful!
                </h2>

                <p className="mt-3">
                    Your enrollment has been completed successfully.
                </p>

                <div className="d-grid gap-2 mt-4">

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/student/dashboard")}
                    >
                        Go to Dashboard
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/student/enrollments")}
                    >
                        View My Courses
                    </button>

                </div>

            </div>

        </div>

    );

}