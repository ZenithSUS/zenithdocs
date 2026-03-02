import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./env.js";
import { oauthCreateOrGetUser } from "../repositories/user.repository.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: `${config.server.backendUrl}${config.google.callbackUrl}`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) return done(null);

        const user = await oauthCreateOrGetUser(email);

        user.password = undefined;

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
