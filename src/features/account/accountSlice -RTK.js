import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanRequest: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },

    loanRequest: {
      prepare(loanAmount, loanPurpose) {
        return {
          payload: { loanAmount, loanPurpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;

        state.balance = state.balance + action.payload.loanAmount;
        state.loan = action.payload.loanAmount;
        state.loanPurpose = action.payload.loanPurpose;
      },
    },

    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },

    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch, getState) {
    const host = "api.frankfurter.app";
    dispatch({ type: "account/convertingCurrency" });
    // API CALL
    const res = await fetch(
      `https://${host}/latest?${amount}=10&from=${currency}&to=USD`
    );

    const data = await res.json();
    const converted = data.rates.USD;
    console.log(converted);

    // RETURN ACTION
    dispatch({ type: "account/deposit", payload: converted });
  };
}

export const { withdraw, loanRequest, payLoan } = accountSlice.actions;

export default accountSlice.reducer;
