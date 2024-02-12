const initialStateCustomer = {
  fullName: "",
  nationalId: "",
  createdAt: "",
};

export default function cutomerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalId: action.payload.nationalId,
        createdAt: action.payload.createAt,
      };

    default:
      return state;
  }
}

export function createCustomer(fullName, nationalId) {
  return {
    type: "customer/createCustomer",
    payload: { fullName, nationalId, createAt: new Date().toISOString() },
  };
}
