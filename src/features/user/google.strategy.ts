import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User, UserType, Role, UserGender } from "./user.model";
import { googleRegisterService } from "./user.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const userName =
          profile.displayName?.replace(/\s+/g, "_") ?? `user_${profile.id}`;
        const phone = (profile as any).phoneNumbers?.[0]?.value ?? null;

        if (!email)
          return done(new Error("Google account has no email."), undefined);

        const existingUser = await User.findOne({
          where: { email, userType: UserType.GOOGLE, active: true },
        });

        if (existingUser) {
          await existingUser.update({ lastLogin: new Date() });
          return done(null, existingUser);
        }

        await googleRegisterService({ userName, email, phone });
        const newUser = await User.findOne({ where: { email } });
        return done(null, newUser as any);
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

export default passport;
