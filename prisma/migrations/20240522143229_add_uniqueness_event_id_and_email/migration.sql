/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `usersEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "usersEvent_event_id_email_key" ON "usersEvent"("event_id", "email");
