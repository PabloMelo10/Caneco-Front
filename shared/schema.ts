import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  isAdmin: true,
});

// Product categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").notNull(),
  inStock: boolean("in_stock").default(true),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  categoryId: true,
  inStock: true,
});

// Sales
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  amountReceived: numeric("amount_received", { precision: 10, scale: 2 }),
  change: numeric("change", { precision: 10, scale: 2 }),
  operatorId: integer("operator_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  items: json("items").notNull(),
});

export const insertSaleSchema = createInsertSchema(sales).pick({
  total: true,
  paymentMethod: true,
  amountReceived: true,
  change: true,
  operatorId: true,
  items: true,
});

// Cash register transactions
export const cashTransactions = pgTable("cash_transactions", {
  id: serial("id").primaryKey(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  notes: text("notes"),
  operatorId: integer("operator_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCashTransactionSchema = createInsertSchema(cashTransactions).pick({
  amount: true,
  reason: true,
  notes: true,
  operatorId: true,
});

// Daily register summaries
export const dailyRegisters = pgTable("daily_registers", {
  id: serial("id").primaryKey(),
  openingBalance: numeric("opening_balance", { precision: 10, scale: 2 }).notNull(),
  closingBalance: numeric("closing_balance", { precision: 10, scale: 2 }).notNull(),
  systemBalance: numeric("system_balance", { precision: 10, scale: 2 }).notNull(),
  cashSales: numeric("cash_sales", { precision: 10, scale: 2 }).notNull(),
  cardSales: numeric("card_sales", { precision: 10, scale: 2 }).notNull(),
  pixSales: numeric("pix_sales", { precision: 10, scale: 2 }).notNull(),
  difference: numeric("difference", { precision: 10, scale: 2 }),
  differenceReason: text("difference_reason"),
  notes: text("notes"),
  operatorId: integer("operator_id").notNull(),
  closedAt: timestamp("closed_at").defaultNow(),
});

export const insertDailyRegisterSchema = createInsertSchema(dailyRegisters).pick({
  openingBalance: true,
  closingBalance: true,
  systemBalance: true,
  cashSales: true,
  cardSales: true,
  pixSales: true,
  difference: true,
  differenceReason: true,
  notes: true,
  operatorId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;

export type InsertCashTransaction = z.infer<typeof insertCashTransactionSchema>;
export type CashTransaction = typeof cashTransactions.$inferSelect;

export type InsertDailyRegister = z.infer<typeof insertDailyRegisterSchema>;
export type DailyRegister = typeof dailyRegisters.$inferSelect;

// Cart item type (not stored in database)
export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};
