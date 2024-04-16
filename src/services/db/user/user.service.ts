import mongoose from "mongoose";
import { IUserDocument } from "../../../interfaces/user.interface";
import { UserModel } from "../../../schemas/user/user.schema";
import { createLogger } from "../../../shared/globals/logger";

const logger = createLogger("UserService");
class UserService {
    public async addUserToDB(data: IUserDocument) {
        await UserModel.create(data);
    }

    public async getUserByAuthID(authId: string): Promise<IUserDocument> {
        logger.info("[getUserByAuthID] - start");

        const user: IUserDocument[] = await UserModel.aggregate([
            { $match: { authId: new mongoose.Types.ObjectId(authId) } },
            {
                $lookup: {
                    from: "Auth",
                    localField: "authId",
                    foreignField: "_id",
                    as: "authId"
                }
            },
            { $unwind: "$authId" },
            { $project: this.aggregateProject() }
        ]);

        logger.info("[getUserByAuthID] - end", user);
        return user[0];
    }

    private aggregateProject() {
        return {
            _id: 1,
            username: "$authId.username",
            uId: "$authId.uId",
            email: "$authId.email",
            avatarColor: "$authId.avatarColor",
            postCount: 1,
            work: 1,
            school: 1,
            quote: 1,
            location: 1,
            blocked: 1,
            blockedBy: 1,
            followersCount: 1,
            followingCount: 1,
            notifications: 1,
            social: 1,
            bgImageVersion: 1,
            bgImageId: 1,
            profilePicture: 1
        };
    }
}

export const userService: UserService = new UserService();
