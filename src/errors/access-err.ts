import { StatusCodes } from "http-status-codes";

class AccessError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default AccessError;
