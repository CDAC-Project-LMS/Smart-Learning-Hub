import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { paymentApi } from '../api/paymentApi';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Payment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    courseApi.getById(courseId).then(({ data }) => setCourse(data));
  }, [courseId]);

  const handlePay = async (e) => {

      e.preventDefault();

      setIsProcessing(true);

      try {

          const response = await paymentApi.createCheckoutSession({

              courseId: course.id,

              courseName: course.title,

              amount: course.price * 100

          });

          // Redirect to Stripe Checkout
          window.location.href = response.data;

      } catch (err) {

          showToast(
              err.response?.data?.message ||
              "Unable to start payment",
              "error"
          );

          setIsProcessing(false);

      }
  };
  if (!course) {
    return <LoadingSpinner fullPage label="Loading order summary…" />;
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h2 className="mb-1">Checkout</h2>
      <p className="text-muted mb-4">This is a simulated payment for demo purposes - no real charge occurs.</p>

      <div className="card p-3 mb-4">
        <div className="d-flex justify-content-between">
          <span>{course.title}</span>
          <span className="fw-semibold">₹{course.price}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between fw-semibold">
          <span>Total</span>
          <span>₹{course.price}</span>
        </div>
      </div>

      <form onSubmit={handlePay}>
        <div className="mb-3">
          <label className="form-label small">Card number</label>
          <input className="form-control" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" required />
        </div>
        <div className="row g-2 mb-4">
          <div className="col-6">
            <label className="form-label small">Expiry</label>
            <input className="form-control" placeholder="MM/YY" defaultValue="12/29" required />
          </div>
          <div className="col-6">
            <label className="form-label small">CVV</label>
            <input className="form-control" placeholder="123" defaultValue="123" required />
          </div>
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing…' : `Pay ₹${course.price}`}
        </button>
      </form>
    </div>
  );
}
