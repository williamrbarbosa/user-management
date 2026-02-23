import { auth } from "./auth";
import { user } from "./user";

const DEFAULT_ERROR_MESSAGE = "Error trying to execute this action.";

export const messages = {
  DEFAULT_ERROR_MESSAGE,
  ...auth,
  ...user,
};
