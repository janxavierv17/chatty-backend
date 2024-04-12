import { Helpers } from "../../../shared/utils/helpers";
import { IAuthDocument } from "../../../interfaces/auth.interface";
import { AuthModel } from "../../../schemas/authentication/auth.schema";

class AuthService {
    public async getUserByUsernameOrEmail(
        username: string,
        email: string
    ): Promise<IAuthDocument> {
        const query = {
            $or: [
                { username: Helpers.firstLetterUppercase(username) },
                { email: Helpers.lowerCase(email) }
            ]
        };

        try {
            const user: IAuthDocument = (await AuthModel.findOne(
                query
            ).exec()) as IAuthDocument;

            return user;
        } catch (err) {
            console.log("Error at Auth Service", err);
            return err as unknown as IAuthDocument;
        }
    }
}

export const authService: AuthService = new AuthService();
