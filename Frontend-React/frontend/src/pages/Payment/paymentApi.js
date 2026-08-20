import axiosClient from "./axiosClient";

export const paymentApi = {
    createCheckoutSession: (data) =>
        axiosClient.post(
            "/api/payments/create-checkout-session",
            data
        )
};