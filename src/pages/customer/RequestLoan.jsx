import { useState } from "react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  submitLoanRequest,
} from "../../features/loans/loanSlice";


const RequestLoan = () => {
  const dispatch = useDispatch();

  const {
    user,
    profile,
  } = useSelector(
    (state) => state.auth
  );

  const {
    submitLoading,
    submitError,
    submitSuccess,
  } = useSelector(
    (state) => state.loans
  );


  const [formData, setFormData] =
    useState({
      amount: "",
      purpose: "",
      duration: "",
      notes: "",
    });


  const [error, setError] =
    useState("");


  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    const amount =
      Number(formData.amount);

    const duration =
      Number(formData.duration);


    if (!user?.uid) {
      setError(
        "You must be logged in to request a loan."
      );

      return;
    }


    if (!formData.amount.trim()) {
      setError(
        "Please enter the loan amount."
      );

      return;
    }


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Please enter a valid loan amount."
      );

      return;
    }


    if (!formData.purpose.trim()) {
      setError(
        "Please enter the loan purpose."
      );

      return;
    }


    if (!formData.duration.trim()) {
      setError(
        "Please enter the loan duration."
      );

      return;
    }


    if (
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      setError(
        "Please enter a valid duration in months."
      );

      return;
    }


    const result =
      await dispatch(
        submitLoanRequest({
          customerId:
            user.uid,

          customerName:
            profile?.fullName ||
            profile?.name ||
            user.email ||
            "Customer",

          amount,

          purpose:
            formData.purpose,

          duration,

          notes:
            formData.notes,
        })
      );


    if (
      submitLoanRequest.fulfilled.match(
        result
      )
    ) {
      setFormData({
        amount: "",
        purpose: "",
        duration: "",
        notes: "",
      });
    }
  };


  return (
    <main>
      <section>
        <h1>
          Request a Loan
        </h1>

        <p>
          Submit a request for a new
          loan. Your request will be
          reviewed according to the
          banking system workflow.
        </p>

        <p>
          <strong>
            Customer:
          </strong>{" "}
          {profile?.fullName ||
            profile?.name ||
            user?.email ||
            "Customer"}
        </p>

        <Link to="/customer">
          Back to Dashboard
        </Link>
      </section>


      <section>
        <form
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="amount">
              Loan Amount
            </label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={
                formData.amount
              }
              onChange={
                handleChange
              }
              placeholder="Enter loan amount"
              disabled={
                submitLoading
              }
            />
          </div>


          <div>
            <label htmlFor="purpose">
              Loan Purpose
            </label>

            <textarea
              id="purpose"
              name="purpose"
              value={
                formData.purpose
              }
              onChange={
                handleChange
              }
              placeholder="Explain the purpose of the loan"
              rows="4"
              disabled={
                submitLoading
              }
            />
          </div>


          <div>
            <label htmlFor="duration">
              Duration (Months)
            </label>

            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              step="1"
              value={
                formData.duration
              }
              onChange={
                handleChange
              }
              placeholder="Enter duration in months"
              disabled={
                submitLoading
              }
            />
          </div>


          <div>
            <label htmlFor="notes">
              Notes (Optional)
            </label>

            <textarea
              id="notes"
              name="notes"
              value={
                formData.notes
              }
              onChange={
                handleChange
              }
              placeholder="Additional notes"
              rows="3"
              disabled={
                submitLoading
              }
            />
          </div>


          {error && (
            <p role="alert">
              {error}
            </p>
          )}


          {submitError && (
            <p role="alert">
              {submitError}
            </p>
          )}


          {submitSuccess && (
            <p role="status">
              Loan request submitted
              successfully. Your request
              is now pending approval.
            </p>
          )}


          <button
            type="submit"
            disabled={
              submitLoading
            }
          >
            {submitLoading
              ? "Submitting..."
              : "Submit Loan Request"}
          </button>
        </form>
      </section>
    </main>
  );
};


export default RequestLoan;