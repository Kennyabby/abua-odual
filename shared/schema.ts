import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull(), // citizen, admin, finance_officer, auditor
});

export const taxpayers = pgTable("taxpayers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taxpayerId: text("taxpayer_id").notNull().unique(),
  type: text("type").notNull(), // individual, business
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  businessName: text("business_name"),
  businessType: text("business_type"),
  registrationNumber: text("registration_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revenueCategories = pgTable("revenue_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  department: text("department").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  isActive: integer("is_active").notNull().default(1),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  taxpayerId: varchar("taxpayer_id").notNull(),
  categoryId: varchar("category_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // pending, paid, cancelled
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  description: text("description"),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rrr: text("rrr").notNull().unique(), // Remita Retrieval Reference
  invoiceId: varchar("invoice_id").notNull(),
  taxpayerId: varchar("taxpayer_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // card, bank_transfer, ussd, mobile_money
  status: text("status").notNull(), // pending, successful, failed
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  payerName: text("payer_name").notNull(),
  payerEmail: text("payer_email").notNull(),
  payerPhone: text("payer_phone").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertTaxpayerSchema = createInsertSchema(taxpayers).omit({ id: true, createdAt: true });
export const insertRevenueCategorySchema = createInsertSchema(revenueCategories).omit({ id: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, transactionDate: true });

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled"]),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Taxpayer = typeof taxpayers.$inferSelect;
export type InsertTaxpayer = z.infer<typeof insertTaxpayerSchema>;

export type RevenueCategory = typeof revenueCategories.$inferSelect;
export type InsertRevenueCategory = z.infer<typeof insertRevenueCategorySchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
