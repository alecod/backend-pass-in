-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usersEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "usersEvent_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_usersEvent" ("created_at", "email", "event_id", "id", "name") SELECT "created_at", "email", "event_id", "id", "name" FROM "usersEvent";
DROP TABLE "usersEvent";
ALTER TABLE "new_usersEvent" RENAME TO "usersEvent";
CREATE UNIQUE INDEX "usersEvent_event_id_email_key" ON "usersEvent"("event_id", "email");
CREATE TABLE "new_check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_check_ins" ("created_at", "id", "user_id") SELECT "created_at", "id", "user_id" FROM "check_ins";
DROP TABLE "check_ins";
ALTER TABLE "new_check_ins" RENAME TO "check_ins";
CREATE UNIQUE INDEX "check_ins_user_id_key" ON "check_ins"("user_id");
PRAGMA foreign_key_check("usersEvent");
PRAGMA foreign_key_check("check_ins");
PRAGMA foreign_keys=ON;
