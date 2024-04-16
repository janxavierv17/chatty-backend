import { authWorker } from "../../workers/auth.worker";
import { IAuthJob } from "../../interfaces/auth.interface";
import { BaseQueue } from "./base.queue";

class AuthQueue extends BaseQueue {
    constructor() {
        super("AuthQueue");
        this.processQueueJob("AddAuthUserToDB", 5, authWorker.addAuthUserToDB);
    }
    public addToJob(name: string, data: IAuthJob): void {
        this.addQueueJob(name, data);
    }
}

export const authQueue = new AuthQueue();
