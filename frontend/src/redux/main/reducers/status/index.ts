import { actionType } from "t9redux/main/constants";
import { Status } from "t9types/template-types";

export const status = (
  state: {
    operations: string[];
    status: Status;
  } = {
      operations: [],
      status: "active",
    },
  action: {
    type: string,
    payload: string,
  }) => {
  switch (action.type) {
    case actionType.STATUS_ADD_OP: // if it doesn't exist, adds the operation, and set status to active
      if (state.operations.includes(action.payload)) {
        return state;
      } else {
        return { operations: [...state.operations, action.payload], status: "active" as Status };
      }
    case actionType.STATUS_REMOVE_OP: // if it exists, remove the operation, & set status to idle when ops list is empty
      if (!state.operations.includes(action.payload)) {
        return state;
      } else {
        const operations = state.operations.filter((op) => op !== action.payload);
        return {
          operations,
          status: (operations.length > 0 ? "active" : "idle") as Status,
        };
      }
    default:
      return state;
  }
};
