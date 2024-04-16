import { IUserDocument } from "../../../interfaces/user.interface";
import { UserModel } from "../../../schemas/user/user.schema";
import { createLogger } from "../../../shared/globals/logger";

const logger = createLogger("UserService");
class UserService {
    public async addUserToDB(data: IUserDocument) {
        await UserModel.create(data);
    }
}

export const userService: UserService = new UserService();
