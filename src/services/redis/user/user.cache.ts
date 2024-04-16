import { APIError } from "../../../shared/globals/errors";
import { IUserDocument } from "../../../interfaces/user.interface";
import { BaseCache } from "../base.cache";

class RedisUser extends BaseCache {
    constructor() {
        super("User.Cache");
    }

    public async cacheUser(
        key: string,
        userId: string,
        createdUser: IUserDocument
    ): Promise<void> {
        const {
            _id,
            uId,
            username,
            email,
            avatarColor,
            blocked,
            blockedBy,
            postsCount,
            profilePicture,
            followersCount,
            followingCount,
            notifications,
            work,
            location,
            school,
            quote,
            bgImageId,
            bgImageVersion,
            social
        } = createdUser;
        const createdAt = new Date();

        const firstList: string[] = [
            "_id",
            `${_id}`,
            "uId",
            `${uId}`,
            "username",
            `${username}`,
            "email",
            `${email}`,
            "avatarColor",
            `${avatarColor}`,
            "createdAt",
            `${createdAt}`,
            "postsCount",
            `${postsCount}`
        ];

        const secondList: string[] = [
            "blocked",
            JSON.stringify(blocked),
            "blockedBy",
            JSON.stringify(blockedBy),
            "profilePicture",
            `${profilePicture}`,
            "followersCount",
            `${followersCount}`,
            "followingCount",
            `${followingCount}`,
            "notifications",
            JSON.stringify(notifications),
            "social",
            JSON.stringify(social)
        ];

        const thirdList: string[] = [
            "work",
            `${work}`,
            "location",
            `${location}`,
            "school",
            `${school}`,
            "quote",
            `${quote}`,
            "bgImageVersion",
            `${bgImageVersion}`,
            "bgImageId",
            `${bgImageId}`
        ];

        const dataToSave: string[] = [
            ...firstList,
            ...secondList,
            ...thirdList
        ];

        try {
            this.logger.info(
                this.redis.isOpen
                    ? "Opening a new redis connection"
                    : "Not required to open another redis connection."
            );

            if (!this.redis.isOpen) await this.redis.connect();

            await this.redis.ZADD("user", {
                score: parseInt(userId, 20),
                value: `${key}`
            });

            await this.redis.HSET(`users:${key}`, dataToSave);
        } catch (err) {
            throw new APIError("Something went wrong at user.cache");
        }
    }
}

export const redisUser = new RedisUser();
