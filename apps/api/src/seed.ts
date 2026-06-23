import bcrypt from "bcryptjs";

import { connectDatabase } from "./db.js";
import { User } from "./models/User.js";

const email = process.env.SEED_USER_EMAIL ?? "demo@apax.local";
const password = process.env.SEED_USER_PASSWORD ?? "password123";
const name = process.env.SEED_USER_NAME ?? "APAX Demo User";

await connectDatabase();

const passwordHash = await bcrypt.hash(password, 12);

await User.findOneAndUpdate(
  { email },
  {
    email,
    name,
    passwordHash,
  },
  {
    new: true,
    upsert: true,
  },
);

console.log(`Seeded user ${email} with password ${password}`);
process.exit(0);
