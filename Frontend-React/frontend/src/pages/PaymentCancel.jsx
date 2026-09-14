import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >
            <div
                className="card shadow-lg p-5 text-center"
                style={{ maxWidth: "550px", width: "100%" }}
            >
                <div className="mb-4">
                    <i
                        className="bi bi-x-circle-fill text-danger"
                        style={{ fontSize: "80px" }}
                    ></i>
                </div>

                <h2 className="text-danger fw-bold">
                    Payment Cancelled
                </h2>

                <p className="text-muted mt-3">
                    Your payment was cancelled or failed.
                </p>

                <div className="d-grid gap-2 mt-4">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(-1)}
                    >
                        Try Again
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/student/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}