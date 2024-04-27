import {json, error} from '@sveltejs/kit';

export class AppError extends Error {
    constructor(message: string, readonly statusCode: number = 400) {
        super(message);
    }

    error() {
        throw error(this.statusCode, this.message);
    }

    response() {
        return json({message: this.message}, {status: this.statusCode});
    }
}
