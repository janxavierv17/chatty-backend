import { Helpers } from "../../../shared/utils/helpers";
import { IAuthDocument } from "../../../interfaces/auth.interface";
import { AuthModel } from "../../../schemas/authentication/auth.schema";
import { createLogger } from "../../../shared/globals/logger";

const logger = createLogger("AuthService");
class AuthService {
    public async getUserByUsernameOrEmail(
        username?: string | undefined,
        email?: string | undefined
    ): Promise<IAuthDocument> {
        const query = {
            $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: Helpers.lowerCase(email) }]
        };

        try {
            const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;

            return user;
        } catch (err) {
            logger.error("Error at Auth Service", err);
            return err as unknown as IAuthDocument;
        }
    }

    public async createAuthUser(data: IAuthDocument): Promise<void> {
        await AuthModel.create(data);
    }
}

export const authService: AuthService = new AuthService();
