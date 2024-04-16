import { DoneCallback, Job } from "bull";
import { createLogger } from "../shared/globals/logger";
import { authService } from "../services/db/auth/auth.service";

const logger = createLogger("AuthWorker");

class AuthWorker {
    async addAuthUserToDB(job: Job, doneCb: DoneCallback): Promise<void> {
        try {
            const { value } = job.data;
            await authService.createAuthUser(value);
            job.progress(100);
            doneCb(null, job.data);
        } catch (err) {
            logger.error(err);
            doneCb(err as Error);
        }
    }
}

export const authWorker = new AuthWorker();
