import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";

import {
  fetchCustomerLoans,
  submitLoanRepayment,
} from "../../../features/loans/loanSlice";

const RepayLoan = () => {
  const dispatch = useDispatch();

  const {
    customerLoans = [],
    loading = false,
    submitLoading = false,
    error = "",
    successMessage = "",
  } = useSelector(
    (state) => state.loans || {}
  );

  const [selectedLoanId, setSelectedLoanId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [notes, setNotes] =
    useState("");

  useEffect(() => {
    const auth = getAuth();

    if (auth.currentUser?.uid) {
      dispatch(
        fetchCustomerLoans(
          auth.currentUser.uid
        )
      );
    }
  }, [dispatch]);

  const approvedLoans =
    customerLoans.filter(
      (loan) =>
        loan.status === "approved" &&
        Number(
          loan.outstandingAmount ??
            loan.amount ??
            0
        ) > 0
    );

  const selectedLoan =
    approvedLoans.find(
      (loan) =>
        loan.id === selectedLoanId
    );

  const outstandingAmount =
    Number(
      selectedLoan?.outstandingAmount ??
        selectedLoan?.amount ??
        0
    );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const auth = getAuth();

    if (!auth.currentUser?.uid) {
      return;
    }

    if (!selectedLoanId) {
      return;
    }

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      return;
    }

    if (
      numericAmount >
      outstandingAmount
    ) {
      return;
    }

    const result = await dispatch(
      submitLoanRepayment({
        loanId:
          selectedLoanId,

        customerId:
          auth.currentUser.uid,

        amount:
          numericAmount,

        notes,
      })
    );

    if (
      submitLoanRepayment.fulfilled.match(
        result
      )
    ) {
      setAmount("");
      setNotes("");
      setSelectedLoanId("");
    }
  };

  return (
    <main>
      <section>
        <h1>Loan Repayment</h1>

        <p>
          Make a repayment toward your
          approved loan.
        </p>
      </section>

      {loading && (
        <p>Loading loans...</p>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {successMessage && (
        <p role="status">
          {successMessage}
        </p>
      )}

      {!loading &&
        approvedLoans.length === 0 && (
          <section>
            <h2>
              No Loan Available
            </h2>

            <p>
              You currently have no
              approved loan with an
              outstanding balance.
            </p>
          </section>
        )}

      {approvedLoans.length > 0 && (
        <form
          onSubmit={handleSubmit}
        >
          <section>
            <label htmlFor="loan">
              Select Loan
            </label>

            <select
              id="loan"
              value={selectedLoanId}
              onChange={(event) =>
                setSelectedLoanId(
                  event.target.value
                )
              }
              required
            >
              <option value="">
                Select an approved loan
              </option>

              {approvedLoans.map(
                (loan) => (
                  <option
                    key={loan.id}
                    value={loan.id}
                  >
                    PKR{" "}
                    {Number(
                      loan.outstandingAmount ??
                        loan.amount ??
                        0
                    ).toLocaleString(
                      "en-PK"
                    )}{" "}
                    outstanding
                  </option>
                )
              )}
            </select>
          </section>

          {selectedLoan && (
            <section>
              <p>
                <strong>
                  Outstanding:
                </strong>{" "}
                PKR{" "}
                {outstandingAmount.toLocaleString(
                  "en-PK"
                )}
              </p>
            </section>
          )}

          <section>
            <label htmlFor="amount">
              Repayment Amount
            </label>

            <input
              id="amount"
              type="number"
              min="1"
              max={outstandingAmount}
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              required
            />
          </section>

          <section>
            <label htmlFor="notes">
              Notes (optional)
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
            />
          </section>

          <button
            type="submit"
            disabled={
              submitLoading ||
              !selectedLoanId ||
              !amount
            }
          >
            {submitLoading
              ? "Submitting..."
              : "Submit Repayment"}
          </button>
        </form>
      )}
    </main>
  );
};

export default RepayLoan;