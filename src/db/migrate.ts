import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
  try {
    console.log("trying to Migrate");
    await migrate(db, {
      migrationsFolder: "src/db/migrations",
    });
    console.log("succesfully migrated");
  } catch (err) {
    console.error("Error during migration", err);
    process.exit(1);
  }
};

main();
