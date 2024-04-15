/* eslint-disable @typescript-eslint/no-explicit-any */
import Queue, { Job } from "bull";
import { createLogger } from "../../shared/globals/logger";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { IAuthJob } from "../../interfaces/auth.interface";

const { REDIS_HOST } = process.env;
let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
    queue: Queue.Queue;
    logger;

    constructor(queueName: string) {
        this.queue = new Queue(queueName, `${REDIS_HOST}`);
        this.logger = createLogger(queueName);

        bullAdapters.push(new BullAdapter(this.queue));
        bullAdapters = [...new Set(bullAdapters)];

        serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath("/queues");

        createBullBoard({
            queues: bullAdapters,
            serverAdapter
        });

        this.queueEvents();
    }

    private queueEvents(): void {
        // There's no need to see the completed job in the dashboard.
        this.queue.on("completed", (job: Job) => job.remove());
        this.queue.on("global:completed", (id: string) =>
            this.logger.info(`Job id:${id} has completed`)
        );
        this.queue.on("global:stalled", (id: string) =>
            this.logger.info(`Job id:${id} has stalled`)
        );
    }

    protected addQueueJob(name: string, data: IAuthJob): void {
        this.queue.add(name, data, {
            attempts: 3,
            backoff: { type: "fixed", delay: 5000 }
        });
    }

    protected processQueueJob(
        name: string,
        concurency: number,
        cb: Queue.ProcessCallbackFunction<void>
    ): void {
        this.queue.process(name, concurency, cb);
    }
}
