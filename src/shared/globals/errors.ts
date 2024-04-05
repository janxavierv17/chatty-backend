import HTTP_STATUS from "http-status-codes";

export interface IErrorResponse {
	message: string;
	statusCode: string;
	status: string;
	serializeErrors(): IError;
}

export interface IError {
	message: string;
	statusCode: number;
	status: string;
}

export abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract status: string;

	constructor(message: string) {
		super(message);
	}

	serializeErrors(): IError {
		return {
			message: this.message,
			status: this.status,
			statusCode: this.statusCode,
		};
	}
}

export class BadRequestError extends CustomError {
	statusCode: number = HTTP_STATUS.BAD_REQUEST;
	status: string = "error";

	constructor(message: string) {
		super(message);
	}
}

export class NotFoundError extends CustomError {
	statusCode: number = HTTP_STATUS.NOT_FOUND;
	status: string = "error";

	constructor(message: string) {
		super(message);
	}
}

export class NotAuthorizedError extends CustomError {
	statusCode: number = HTTP_STATUS.UNAUTHORIZED;
	status: string = "error";

	constructor(message: string) {
		super(message);
	}
}

export class FileTooLargeError extends CustomError {
	statusCode: number = HTTP_STATUS.REQUEST_TOO_LONG;
	status: string = "error";

	constructor(message: string) {
		super(message);
	}
}

export class APIError extends CustomError {
	statusCode: number = HTTP_STATUS.SERVICE_UNAVAILABLE;
	status: string = "error";

	constructor(message: string) {
		super(message);
	}
}

export class JoiRequestValidationError extends CustomError {
	statusCode: number = HTTP_STATUS.BAD_REQUEST;
	status: string = "error";

	constructor(message: string) {
		super(message);
	}
}
