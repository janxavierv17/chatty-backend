import { userWorker } from "../../workers/user.worker";
import { IAuthJob } from "../../interfaces/auth.interface";
import { BaseQueue } from "./base.queue";

class UserQueue extends BaseQueue {
    constructor() {
        super("UserQueue");
        this.processQueueJob("AddUserToDB", 5, userWorker.addUserToDB);
    }
    public AddToJob(name: string, data: IAuthJob): void {
        this.addQueueJob(name, data);
    }
}

export const userQueue = new UserQueue();
