import { IAuthJob } from "../../interfaces/auth.interface";
import { BaseQueue } from "./base.queue";

class AuthQueue extends BaseQueue {
    constructor() {
        super("AuthQueue");
    }
    public addAuthUserJob(name: string, data: IAuthJob): void {
        this.addQueueJob(name, data);
    }
}

export const authQueue = new AuthQueue();
