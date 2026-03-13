import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const walletTypeEnum = pgEnum("wallet_type", ["main", "agent"]);

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: walletTypeEnum("type").notNull(),
  address: text("address").notNull().unique(),
  encryptedPrivateKey: text("encrypted_private_key"),
  derivationPath: text("derivation_path"),
  derivationIndex: integer("derivation_index"),
  subaccountId: uuid("subaccount_id").references(() => subaccounts.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const subaccounts = pgTable("subaccounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  derivationIndex: integer("derivation_index").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, { fields: [wallets.userId], references: [users.id] }),
  subaccount: one(subaccounts, {
    fields: [wallets.subaccountId],
    references: [subaccounts.id],
  }),
}));

export const subaccountsRelations = relations(subaccounts, ({ one, many }) => ({
  user: one(users, { fields: [subaccounts.userId], references: [users.id] }),
  agentWallet: many(wallets),
}));
