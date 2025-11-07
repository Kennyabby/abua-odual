import { eq, sql } from 'drizzle-orm';
import type { Db } from './db';
import {
  users,
  taxpayers,
  revenueCategories,
  invoices,
  payments,
  businessRegistrations,
  paymentConfigurations,
  type User,
  type InsertUser,
  type Taxpayer,
  type InsertTaxpayer,
  type RevenueCategory,
  type InsertRevenueCategory,
  type Invoice,
  type InsertInvoice,
  type Payment,
  type InsertPayment,
  type BusinessRegistration,
  type InsertBusinessRegistration,
  type PaymentConfiguration,
  type InsertPaymentConfiguration,
} from '@shared/schema';
import type { IStorage } from './storage';

export class PostgresStorage implements IStorage {
  constructor(private db: NonNullable<Db>) {}

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await this.db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Taxpayers
  async getTaxpayer(id: string): Promise<Taxpayer | undefined> {
    const result = await this.db.select().from(taxpayers).where(eq(taxpayers.id, id));
    return result[0];
  }

  async getTaxpayerByTaxpayerId(taxpayerId: string): Promise<Taxpayer | undefined> {
    const result = await this.db.select().from(taxpayers).where(eq(taxpayers.taxpayerId, taxpayerId));
    return result[0];
  }

  async getAllTaxpayers(): Promise<Taxpayer[]> {
    return await this.db.select().from(taxpayers);
  }

  async createTaxpayer(taxpayer: InsertTaxpayer): Promise<Taxpayer> {
    const result = await this.db.insert(taxpayers).values(taxpayer).returning();
    return result[0];
  }

  async updateTaxpayer(id: string, updates: Partial<InsertTaxpayer>): Promise<Taxpayer | undefined> {
    const result = await this.db
      .update(taxpayers)
      .set(updates)
      .where(eq(taxpayers.id, id))
      .returning();
    return result[0];
  }

  async deleteTaxpayer(id: string): Promise<boolean> {
    const result = await this.db.delete(taxpayers).where(eq(taxpayers.id, id)).returning();
    return result.length > 0;
  }

  // Revenue Categories
  async getRevenueCategory(id: string): Promise<RevenueCategory | undefined> {
    const result = await this.db.select().from(revenueCategories).where(eq(revenueCategories.id, id));
    return result[0];
  }

  async getAllRevenueCategories(): Promise<RevenueCategory[]> {
    return await this.db.select().from(revenueCategories);
  }

  async createRevenueCategory(category: InsertRevenueCategory): Promise<RevenueCategory> {
    const result = await this.db.insert(revenueCategories).values(category).returning();
    return result[0];
  }

  async updateRevenueCategory(id: string, updates: Partial<InsertRevenueCategory>): Promise<RevenueCategory | undefined> {
    const result = await this.db
      .update(revenueCategories)
      .set(updates)
      .where(eq(revenueCategories.id, id))
      .returning();
    return result[0];
  }

  async deleteRevenueCategory(id: string): Promise<boolean> {
    const result = await this.db.delete(revenueCategories).where(eq(revenueCategories.id, id)).returning();
    return result.length > 0;
  }

  // Invoices
  async getInvoice(id: string): Promise<Invoice | undefined> {
    const result = await this.db.select().from(invoices).where(eq(invoices.id, id));
    return result[0];
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    const result = await this.db.select().from(invoices).where(eq(invoices.invoiceNumber, invoiceNumber));
    return result[0];
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await this.db.select().from(invoices);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const result = await this.db.insert(invoices).values(invoice).returning();
    return result[0];
  }

  async updateInvoiceStatus(id: string, status: string): Promise<Invoice | undefined> {
    const result = await this.db
      .update(invoices)
      .set({ status })
      .where(eq(invoices.id, id))
      .returning();
    return result[0];
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const result = await this.db.delete(invoices).where(eq(invoices.id, id)).returning();
    return result.length > 0;
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await this.db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async getPaymentByRRR(rrr: string): Promise<Payment | undefined> {
    const result = await this.db.select().from(payments).where(eq(payments.rrr, rrr));
    return result[0];
  }

  async getAllPayments(): Promise<Payment[]> {
    return await this.db.select().from(payments);
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await this.db.insert(payments).values(payment).returning();
    return result[0];
  }

  async updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const result = await this.db
      .update(payments)
      .set(updates)
      .where(eq(payments.id, id))
      .returning();
    return result[0];
  }

  async deletePayment(id: string): Promise<boolean> {
    const result = await this.db.delete(payments).where(eq(payments.id, id)).returning();
    return result.length > 0;
  }

  // Business Registrations
  async getBusinessRegistration(id: string): Promise<BusinessRegistration | undefined> {
    const result = await this.db.select().from(businessRegistrations).where(eq(businessRegistrations.id, id));
    return result[0];
  }

  async getBusinessRegistrationByNumber(registrationNumber: string): Promise<BusinessRegistration | undefined> {
    const result = await this.db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.registrationNumber, registrationNumber));
    return result[0];
  }

  async getAllBusinessRegistrations(): Promise<BusinessRegistration[]> {
    return await this.db.select().from(businessRegistrations);
  }

  async createBusinessRegistration(registration: InsertBusinessRegistration): Promise<BusinessRegistration> {
    const result = await this.db.insert(businessRegistrations).values(registration).returning();
    return result[0];
  }

  async updateBusinessRegistrationStatus(
    id: string,
    status: string,
    rejectionReason?: string,
    reviewedBy?: string
  ): Promise<BusinessRegistration | undefined> {
    const updates: any = { status };
    if (rejectionReason !== undefined) updates.rejectionReason = rejectionReason;
    if (reviewedBy !== undefined) updates.reviewedBy = reviewedBy;

    const result = await this.db
      .update(businessRegistrations)
      .set(updates)
      .where(eq(businessRegistrations.id, id))
      .returning();
    return result[0];
  }

  async deleteBusinessRegistration(id: string): Promise<boolean> {
    const result = await this.db.delete(businessRegistrations).where(eq(businessRegistrations.id, id)).returning();
    return result.length > 0;
  }

  // Payment Configurations
  async getPaymentConfiguration(id: string): Promise<PaymentConfiguration | undefined> {
    const result = await this.db.select().from(paymentConfigurations).where(eq(paymentConfigurations.id, id));
    return result[0];
  }

  async getAllPaymentConfigurations(): Promise<PaymentConfiguration[]> {
    return await this.db.select().from(paymentConfigurations);
  }

  async getPaymentConfigurationsByCategory(categoryId: string | null): Promise<PaymentConfiguration[]> {
    if (categoryId === null) {
      const result = await this.db
        .select()
        .from(paymentConfigurations)
        .where(sql`${paymentConfigurations.categoryId} IS NULL`);
      return result;
    }
    return await this.db
      .select()
      .from(paymentConfigurations)
      .where(eq(paymentConfigurations.categoryId, categoryId));
  }

  async createPaymentConfiguration(config: InsertPaymentConfiguration): Promise<PaymentConfiguration> {
    const result = await this.db.insert(paymentConfigurations).values(config).returning();
    return result[0];
  }

  async updatePaymentConfiguration(
    id: string,
    updates: Partial<InsertPaymentConfiguration>
  ): Promise<PaymentConfiguration | undefined> {
    const result = await this.db
      .update(paymentConfigurations)
      .set(updates)
      .where(eq(paymentConfigurations.id, id))
      .returning();
    return result[0];
  }

  async deletePaymentConfiguration(id: string): Promise<boolean> {
    const result = await this.db.delete(paymentConfigurations).where(eq(paymentConfigurations.id, id)).returning();
    return result.length > 0;
  }

  async getEnabledPaymentMethods(categoryId?: string): Promise<string[]> {
    let configs: PaymentConfiguration[];
    
    if (categoryId) {
      configs = await this.getPaymentConfigurationsByCategory(categoryId);
      
      if (configs.length === 0) {
        configs = await this.getPaymentConfigurationsByCategory(null);
      }
    } else {
      configs = await this.getPaymentConfigurationsByCategory(null);
    }

    return configs
      .filter((config) => config.isEnabled === 1)
      .map((config) => config.paymentMethod);
  }
}
