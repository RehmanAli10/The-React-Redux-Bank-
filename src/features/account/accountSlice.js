const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanRequest: 0,
  loanPurpose: "",
  isLoading: false,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
      };
    case "account/withdraw":
      if (action.payload > state.balance) return state;
      return { ...state, balance: state.balance - action.payload };
    case "account/loanRequest":
      if (state.loan > 0) return state;
      return {
        ...state,
        balance: state.balance + action.payload.loanAmount,
        loan: action.payload.loanAmount,
        loanPurpose: action.payload.loanPurpose,
      };
    case "account/payLoan":
      if (!state.balance > 0) return state;
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };

    case "account/convertingCurrency":
      return { ...state, isLoading: true };

    default:
      return state;
  }
}

// ACTION CREATORS

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
export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}
export function loanRequest(loanAmount, loanPurpose) {
  return { type: "account/loanRequest", payload: { loanAmount, loanPurpose } };
}
export function payLoan() {
  return { type: "account/payLoan" };
}
