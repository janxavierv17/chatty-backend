import { DoneCallback, Job } from "bull";
import { createLogger } from "../shared/globals/logger";
import { userService } from "../services/db/user/user.service";

const logger = createLogger("UserWorker");
class UserWorker {
    async addUserToDB(job: Job, doneCb: DoneCallback): Promise<void> {
        try {
            const { value } = job.data;
            await userService.addUserToDB(value);
            job.progress(100);
            doneCb(null, job.data);
        } catch (err) {
            logger.error(err);
            doneCb(err as Error);
        }
    }
}

export const userWorker = new UserWorker();
