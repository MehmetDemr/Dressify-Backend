import passport from "passport";
import AppleStrategy from "passport-apple";
import { User, UserType, Role, UserGender } from "./user.model";
import { Permission } from "../permission/permission.model";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generatePassword = (): string => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const special = '!@#$%^&*(),.?":{}|<>';
  const all = upper + lower + special + "0123456789";
  const pick = (pool: string) => pool[crypto.randomInt(0, pool.length)];
  const mandatory = [pick(upper), pick(lower), pick(special)];
  const rest = Array.from({ length: crypto.randomInt(15, 26) - 3 }, () =>
    pick(all),
  );
  const chars = [...mandatory, ...rest];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
};

passport.use(
  "apple",
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID!,
      teamID: process.env.APPLE_TEAM_ID!,
      keyID: process.env.APPLE_KEY_ID!,
      privateKeyString: process.env
        .APPLE_PRIVATE_KEY!.replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .trim(),
      callbackURL: process.env.APPLE_CALLBACK_URL!,
      passReqToCallback: false,
    },
    async (_accessToken, _refreshToken, idToken, profile, done) => {
      try {
         const decoded = jwt.decode(idToken as unknown as string) as any;

        //  console.log("decoded idToken:", decoded); 
        //  console.log("profile:", profile); 

         const email = decoded?.email ?? (profile as any)?.email;
        if (!email)
          return done(new Error("Apple account has no email."), undefined);

        // Login
        const existingUser = await User.findOne({
          where: { email, userType: UserType.APPLE, active: true },
        });

        if (existingUser) {
          await existingUser.update({ lastLogin: new Date() });
          return done(null, existingUser);
        }

        // Register
        const rawName = profile?.name;
        const baseName = rawName
          ? `${rawName.firstName ?? ""}_${rawName.lastName ?? ""}`
              .toLowerCase()
              .replace(/\s+/g, "_")
          : `apple_${crypto.randomInt(10000, 99999)}`;

        const existingUsername = await User.findOne({
          where: { userName: baseName },
        });
        const finalUserName = existingUsername
          ? `${baseName}_${crypto.randomInt(100, 999)}`
          : baseName;

        const hashedPassword = await bcrypt.hash(generatePassword(), 10);

        const user = await User.create({
          userName: finalUserName,
          email,
          phone: "",
          gender: UserGender.UNKNOWN,
          password: hashedPassword,
          role: Role.USER,
          userType: UserType.APPLE,
          active: true,
          firstLogin: new Date(),
          lastLogin: new Date(),
        });

        await Permission.create({
          user_id: user.id,
          emailNotifyForNewuser: false,
          emailNotifyForDiscount: false,
          smsNotifyForNewuser: false,
          smsNotifyForDiscount: false,
          smsTwoFA: false,
          emailToFA: false,
          newLoginWarning: false,
          active: true,
        } as any);

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

export default passport;
