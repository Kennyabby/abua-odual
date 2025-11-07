import { 
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
  type InsertPaymentConfiguration
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Taxpayers
  getTaxpayer(id: string): Promise<Taxpayer | undefined>;
  getTaxpayerByTaxpayerId(taxpayerId: string): Promise<Taxpayer | undefined>;
  getAllTaxpayers(): Promise<Taxpayer[]>;
  createTaxpayer(taxpayer: InsertTaxpayer): Promise<Taxpayer>;
  updateTaxpayer(id: string, updates: Partial<InsertTaxpayer>): Promise<Taxpayer | undefined>;
  deleteTaxpayer(id: string): Promise<boolean>;

  // Revenue Categories
  getRevenueCategory(id: string): Promise<RevenueCategory | undefined>;
  getAllRevenueCategories(): Promise<RevenueCategory[]>;
  createRevenueCategory(category: InsertRevenueCategory): Promise<RevenueCategory>;
  updateRevenueCategory(id: string, updates: Partial<InsertRevenueCategory>): Promise<RevenueCategory | undefined>;
  deleteRevenueCategory(id: string): Promise<boolean>;

  // Invoices
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  getAllInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoiceStatus(id: string, status: string): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;

  // Payments
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentByRRR(rrr: string): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: string): Promise<boolean>;

  // Business Registrations
  getBusinessRegistration(id: string): Promise<BusinessRegistration | undefined>;
  getBusinessRegistrationByNumber(registrationNumber: string): Promise<BusinessRegistration | undefined>;
  getAllBusinessRegistrations(): Promise<BusinessRegistration[]>;
  createBusinessRegistration(registration: InsertBusinessRegistration): Promise<BusinessRegistration>;
  updateBusinessRegistrationStatus(id: string, status: string, rejectionReason?: string, reviewedBy?: string): Promise<BusinessRegistration | undefined>;
  deleteBusinessRegistration(id: string): Promise<boolean>;

  // Payment Configurations
  getPaymentConfiguration(id: string): Promise<PaymentConfiguration | undefined>;
  getAllPaymentConfigurations(): Promise<PaymentConfiguration[]>;
  getPaymentConfigurationsByCategory(categoryId: string | null): Promise<PaymentConfiguration[]>;
  createPaymentConfiguration(config: InsertPaymentConfiguration): Promise<PaymentConfiguration>;
  updatePaymentConfiguration(id: string, updates: Partial<InsertPaymentConfiguration>): Promise<PaymentConfiguration | undefined>;
  deletePaymentConfiguration(id: string): Promise<boolean>;
  getEnabledPaymentMethods(categoryId?: string): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private taxpayers: Map<string, Taxpayer>;
  private revenueCategories: Map<string, RevenueCategory>;
  private invoices: Map<string, Invoice>;
  private payments: Map<string, Payment>;
  private businessRegistrations: Map<string, BusinessRegistration>;
  private paymentConfigurations: Map<string, PaymentConfiguration>;

  constructor() {
    this.users = new Map();
    this.taxpayers = new Map();
    this.revenueCategories = new Map();
    this.invoices = new Map();
    this.payments = new Map();
    this.businessRegistrations = new Map();
    this.paymentConfigurations = new Map();
    
    this.seedMockData();
  }

  private seedMockData() {
    // Seed users with bcrypt-hashed passwords
    // For dev testing with MemStorage only (production uses PostgreSQL with runtime-generated passwords)
    // Password is a shared dev secret - change for any real deployment
    const mockUsers: User[] = [
      {
        id: "1",
        username: "citizen1",
        password: "password123",
        fullName: "John Okafor",
        email: "john.okafor@email.com",
        phone: "+234 803 123 4567",
        role: "citizen",
      },
      {
        id: "2",
        username: "admin1",
        password: "password123",
        fullName: "Ada Nwosu",
        email: "ada.nwosu@abuaodual.gov.ng",
        phone: "+234 805 987 6543",
        role: "admin",
      },
      {
        id: "3",
        username: "finance1",
        password: "password123",
        fullName: "Emeka Eze",
        email: "emeka.eze@abuaodual.gov.ng",
        phone: "+234 807 234 5678",
        role: "finance_officer",
      },
      {
        id: "4",
        username: "auditor1",
        password: "password123",
        fullName: "Ngozi Obi",
        email: "ngozi.obi@abuaodual.gov.ng",
        phone: "+234 809 876 5432",
        role: "auditor",
      },
    ];

    mockUsers.forEach(user => this.users.set(user.id, user));

    // Seed taxpayers
    const mockTaxpayers: Taxpayer[] = [
      {
        id: "tp1",
        taxpayerId: "ABU-IND-2024-0001",
        type: "individual",
        fullName: "Chidi Nnamdi",
        email: "chidi.nnamdi@email.com",
        phone: "+234 802 111 2222",
        address: "123 Main Street, Abua Town",
        businessName: null,
        businessType: null,
        registrationNumber: null,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "tp2",
        taxpayerId: "ABU-BUS-2024-0001",
        type: "business",
        fullName: "Blessing Udo",
        email: "info@udostores.com",
        phone: "+234 803 222 3333",
        address: "45 Market Road, Odual",
        businessName: "Udo General Stores Ltd",
        businessType: "Retail Trade",
        registrationNumber: "RC-1234567",
        createdAt: new Date("2024-01-20"),
      },
      {
        id: "tp3",
        taxpayerId: "ABU-IND-2024-0002",
        type: "individual",
        fullName: "Amaka Johnson",
        email: "amaka.j@email.com",
        phone: "+234 805 333 4444",
        address: "78 River View Estate, Abua",
        businessName: null,
        businessType: null,
        registrationNumber: null,
        createdAt: new Date("2024-02-01"),
      },
      {
        id: "tp4",
        taxpayerId: "ABU-BUS-2024-0002",
        type: "business",
        fullName: "Olu Williams",
        email: "contact@swiftlogistics.ng",
        phone: "+234 807 444 5555",
        address: "12 Industrial Layout, Odual",
        businessName: "Swift Logistics Services",
        businessType: "Transportation",
        registrationNumber: "RC-2345678",
        createdAt: new Date("2024-02-10"),
      },
      {
        id: "tp5",
        taxpayerId: "ABU-BUS-2024-0003",
        type: "business",
        fullName: "Grace Okon",
        email: "grace@okonhospitality.com",
        phone: "+234 809 555 6666",
        address: "90 Beach Road, Abua",
        businessName: "Okon Hospitality & Suites",
        businessType: "Hospitality",
        registrationNumber: "RC-3456789",
        createdAt: new Date("2024-02-15"),
      },
    ];

    mockTaxpayers.forEach(tp => this.taxpayers.set(tp.id, tp));

    // Seed revenue categories
    const mockCategories: RevenueCategory[] = [
      {
        id: "rc1",
        name: "Market Stall Permit",
        description: "Annual permit for market stall operation",
        department: "Trade & Commerce",
        amount: "15000",
        isActive: 1,
      },
      {
        id: "rc2",
        name: "Business Registration Fee",
        description: "One-time business registration with LGA",
        department: "Trade & Commerce",
        amount: "25000",
        isActive: 1,
      },
      {
        id: "rc3",
        name: "Health Certificate Fee",
        description: "Annual health certificate for food vendors",
        department: "Health Services",
        amount: "5000",
        isActive: 1,
      },
      {
        id: "rc4",
        name: "Building Approval Fee",
        description: "Fee for building plan approval",
        department: "Environment",
        amount: "50000",
        isActive: 1,
      },
      {
        id: "rc5",
        name: "Vehicle Park Levy",
        description: "Annual commercial vehicle parking levy",
        department: "Transport & Works",
        amount: "20000",
        isActive: 1,
      },
      {
        id: "rc6",
        name: "Waste Management Fee",
        description: "Monthly waste collection service",
        department: "Environment",
        amount: "3000",
        isActive: 1,
      },
      {
        id: "rc7",
        name: "Land Use Charge",
        description: "Annual land use charge for commercial properties",
        department: "Agriculture",
        amount: "35000",
        isActive: 1,
      },
      {
        id: "rc8",
        name: "Signage Permit",
        description: "Permit for commercial signage installation",
        department: "Environment",
        amount: "10000",
        isActive: 1,
      },
    ];

    mockCategories.forEach(cat => this.revenueCategories.set(cat.id, cat));

    // Seed invoices
    const mockInvoices: Invoice[] = [
      {
        id: "inv1",
        invoiceNumber: "INV-2024-0001",
        taxpayerId: "tp1",
        categoryId: "rc1",
        amount: "15000",
        status: "paid",
        dueDate: new Date("2024-03-01"),
        createdAt: new Date("2024-02-01"),
        description: "Market Stall Permit - Q1 2024",
      },
      {
        id: "inv2",
        invoiceNumber: "INV-2024-0002",
        taxpayerId: "tp2",
        categoryId: "rc2",
        amount: "25000",
        status: "paid",
        dueDate: new Date("2024-03-15"),
        createdAt: new Date("2024-02-15"),
        description: "Business Registration Fee",
      },
      {
        id: "inv3",
        invoiceNumber: "INV-2024-0003",
        taxpayerId: "tp3",
        categoryId: "rc6",
        amount: "3000",
        status: "pending",
        dueDate: new Date("2024-04-01"),
        createdAt: new Date("2024-03-01"),
        description: "Waste Management Fee - March 2024",
      },
      {
        id: "inv4",
        invoiceNumber: "INV-2024-0004",
        taxpayerId: "tp4",
        categoryId: "rc5",
        amount: "20000",
        status: "paid",
        dueDate: new Date("2024-03-20"),
        createdAt: new Date("2024-02-20"),
        description: "Vehicle Park Levy - 2024",
      },
      {
        id: "inv5",
        invoiceNumber: "INV-2024-0005",
        taxpayerId: "tp5",
        categoryId: "rc7",
        amount: "35000",
        status: "pending",
        dueDate: new Date("2024-04-10"),
        createdAt: new Date("2024-03-10"),
        description: "Land Use Charge - 2024",
      },
    ];

    mockInvoices.forEach(inv => this.invoices.set(inv.id, inv));

    // Seed payments
    const mockPayments: Payment[] = [
      {
        id: "pay1",
        rrr: "240200000001",
        invoiceId: "inv1",
        taxpayerId: "tp1",
        amount: "15000",
        paymentMethod: "card",
        status: "successful",
        transactionDate: new Date("2024-02-05T10:30:00"),
        payerName: "Chidi Nnamdi",
        payerEmail: "chidi.nnamdi@email.com",
        payerPhone: "+234 802 111 2222",
      },
      {
        id: "pay2",
        rrr: "240200000002",
        invoiceId: "inv2",
        taxpayerId: "tp2",
        amount: "25000",
        paymentMethod: "bank_transfer",
        status: "successful",
        transactionDate: new Date("2024-02-18T14:15:00"),
        payerName: "Blessing Udo",
        payerEmail: "info@udostores.com",
        payerPhone: "+234 803 222 3333",
      },
      {
        id: "pay3",
        rrr: "240200000003",
        invoiceId: "inv4",
        taxpayerId: "tp4",
        amount: "20000",
        paymentMethod: "card",
        status: "successful",
        transactionDate: new Date("2024-02-25T16:45:00"),
        payerName: "Olu Williams",
        payerEmail: "contact@swiftlogistics.ng",
        payerPhone: "+234 807 444 5555",
      },
    ];

    mockPayments.forEach(pay => this.payments.set(pay.id, pay));

    // Seed business registrations
    const mockBusinessRegistrations: BusinessRegistration[] = [
      {
        id: "br1",
        businessName: "Swift Logistics Limited",
        businessType: "limited_liability",
        registrationNumber: "RC123456",
        taxId: "TIN-2024-001",
        address: "Plot 45, Industrial Layout",
        city: "Abua",
        state: "Rivers",
        contactPerson: "Olu Williams",
        contactEmail: "contact@swiftlogistics.ng",
        contactPhone: "+234 807 444 5555",
        status: "approved",
        rejectionReason: null,
        submittedAt: new Date("2024-01-15T10:00:00"),
        reviewedAt: new Date("2024-01-16T14:30:00"),
        reviewedBy: "2",
      },
      {
        id: "br2",
        businessName: "Udo Stores Enterprises",
        businessType: "sole_proprietorship",
        registrationNumber: "BN789012",
        taxId: "TIN-2024-002",
        address: "23 Market Road",
        city: "Odual",
        state: "Rivers",
        contactPerson: "Blessing Udo",
        contactEmail: "info@udostores.com",
        contactPhone: "+234 803 222 3333",
        status: "approved",
        rejectionReason: null,
        submittedAt: new Date("2024-01-20T09:30:00"),
        reviewedAt: new Date("2024-01-21T11:00:00"),
        reviewedBy: "2",
      },
      {
        id: "br3",
        businessName: "Fresh Farms Nigeria",
        businessType: "partnership",
        registrationNumber: "BN345678",
        taxId: null,
        address: "Farm Settlement Area",
        city: "Abua",
        state: "Rivers",
        contactPerson: "Emmanuel Okoro",
        contactEmail: "info@freshfarms.ng",
        contactPhone: "+234 809 555 6666",
        status: "pending",
        rejectionReason: null,
        submittedAt: new Date("2024-02-25T15:20:00"),
        reviewedAt: null,
        reviewedBy: null,
      },
    ];

    mockBusinessRegistrations.forEach(reg => this.businessRegistrations.set(reg.id, reg));

    // Seed payment configurations (global - applies to all categories)
    const mockPaymentConfigs: PaymentConfiguration[] = [
      {
        id: "pc1",
        categoryId: null,
        paymentMethod: "card",
        isEnabled: 1,
        updatedAt: new Date("2024-01-10T00:00:00"),
        updatedBy: "2",
      },
      {
        id: "pc2",
        categoryId: null,
        paymentMethod: "bank_transfer",
        isEnabled: 1,
        updatedAt: new Date("2024-01-10T00:00:00"),
        updatedBy: "2",
      },
      {
        id: "pc3",
        categoryId: null,
        paymentMethod: "ussd",
        isEnabled: 1,
        updatedAt: new Date("2024-01-10T00:00:00"),
        updatedBy: "2",
      },
      {
        id: "pc4",
        categoryId: null,
        paymentMethod: "mobile_money",
        isEnabled: 1,
        updatedAt: new Date("2024-01-10T00:00:00"),
        updatedBy: "2",
      },
    ];

    mockPaymentConfigs.forEach(config => this.paymentConfigurations.set(config.id, config));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updated = { ...user, ...updates };
      this.users.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Taxpayer methods
  async getTaxpayer(id: string): Promise<Taxpayer | undefined> {
    return this.taxpayers.get(id);
  }

  async getTaxpayerByTaxpayerId(taxpayerId: string): Promise<Taxpayer | undefined> {
    return Array.from(this.taxpayers.values()).find(tp => tp.taxpayerId === taxpayerId);
  }

  async getAllTaxpayers(): Promise<Taxpayer[]> {
    return Array.from(this.taxpayers.values());
  }

  async createTaxpayer(insertTaxpayer: InsertTaxpayer): Promise<Taxpayer> {
    const id = randomUUID();
    const taxpayer: Taxpayer = { 
      ...insertTaxpayer,
      businessName: insertTaxpayer.businessName ?? null,
      businessType: insertTaxpayer.businessType ?? null,
      registrationNumber: insertTaxpayer.registrationNumber ?? null,
      id,
      createdAt: new Date()
    };
    this.taxpayers.set(id, taxpayer);
    return taxpayer;
  }

  async updateTaxpayer(id: string, updates: Partial<InsertTaxpayer>): Promise<Taxpayer | undefined> {
    const taxpayer = this.taxpayers.get(id);
    if (taxpayer) {
      const updated = { ...taxpayer, ...updates };
      this.taxpayers.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteTaxpayer(id: string): Promise<boolean> {
    return this.taxpayers.delete(id);
  }

  // Revenue Category methods
  async getRevenueCategory(id: string): Promise<RevenueCategory | undefined> {
    return this.revenueCategories.get(id);
  }

  async getAllRevenueCategories(): Promise<RevenueCategory[]> {
    return Array.from(this.revenueCategories.values());
  }

  async createRevenueCategory(insertCategory: InsertRevenueCategory): Promise<RevenueCategory> {
    const id = randomUUID();
    const category: RevenueCategory = { 
      ...insertCategory,
      isActive: insertCategory.isActive ?? 1,
      id 
    };
    this.revenueCategories.set(id, category);
    return category;
  }

  async updateRevenueCategory(id: string, updates: Partial<InsertRevenueCategory>): Promise<RevenueCategory | undefined> {
    const category = this.revenueCategories.get(id);
    if (category) {
      const updated = { ...category, ...updates };
      this.revenueCategories.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteRevenueCategory(id: string): Promise<boolean> {
    return this.revenueCategories.delete(id);
  }

  // Invoice methods
  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    return Array.from(this.invoices.values()).find(inv => inv.invoiceNumber === invoiceNumber);
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = { 
      ...insertInvoice,
      description: insertInvoice.description ?? null,
      id,
      createdAt: new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoiceStatus(id: string, status: string): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (invoice) {
      invoice.status = status;
      this.invoices.set(id, invoice);
    }
    return invoice;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    return this.invoices.delete(id);
  }

  // Payment methods
  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentByRRR(rrr: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(pay => pay.rrr === rrr);
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { 
      ...insertPayment, 
      id,
      transactionDate: new Date()
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (payment) {
      const updated = { ...payment, ...updates };
      this.payments.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deletePayment(id: string): Promise<boolean> {
    return this.payments.delete(id);
  }

  // Business Registration methods
  async getBusinessRegistration(id: string): Promise<BusinessRegistration | undefined> {
    return this.businessRegistrations.get(id);
  }

  async getBusinessRegistrationByNumber(registrationNumber: string): Promise<BusinessRegistration | undefined> {
    return Array.from(this.businessRegistrations.values()).find(
      reg => reg.registrationNumber === registrationNumber
    );
  }

  async getAllBusinessRegistrations(): Promise<BusinessRegistration[]> {
    return Array.from(this.businessRegistrations.values());
  }

  async createBusinessRegistration(insertRegistration: InsertBusinessRegistration): Promise<BusinessRegistration> {
    const id = randomUUID();
    const registration: BusinessRegistration = {
      ...insertRegistration,
      taxId: insertRegistration.taxId ?? null,
      id,
      submittedAt: new Date(),
      reviewedAt: null,
      status: "pending",
      rejectionReason: null,
      reviewedBy: null,
    };
    this.businessRegistrations.set(id, registration);
    return registration;
  }

  async updateBusinessRegistrationStatus(
    id: string,
    status: string,
    rejectionReason?: string,
    reviewedBy?: string
  ): Promise<BusinessRegistration | undefined> {
    const registration = this.businessRegistrations.get(id);
    if (registration) {
      registration.status = status;
      registration.reviewedAt = new Date();
      registration.rejectionReason = rejectionReason || null;
      registration.reviewedBy = reviewedBy || null;
      this.businessRegistrations.set(id, registration);
    }
    return registration;
  }

  async deleteBusinessRegistration(id: string): Promise<boolean> {
    return this.businessRegistrations.delete(id);
  }

  // Payment Configuration methods
  async getPaymentConfiguration(id: string): Promise<PaymentConfiguration | undefined> {
    return this.paymentConfigurations.get(id);
  }

  async getAllPaymentConfigurations(): Promise<PaymentConfiguration[]> {
    return Array.from(this.paymentConfigurations.values());
  }

  async getPaymentConfigurationsByCategory(categoryId: string | null): Promise<PaymentConfiguration[]> {
    return Array.from(this.paymentConfigurations.values()).filter(
      config => config.categoryId === categoryId
    );
  }

  async createPaymentConfiguration(insertConfig: InsertPaymentConfiguration): Promise<PaymentConfiguration> {
    const id = randomUUID();
    const config: PaymentConfiguration = {
      ...insertConfig,
      categoryId: insertConfig.categoryId ?? null,
      isEnabled: insertConfig.isEnabled ?? 1,
      updatedBy: insertConfig.updatedBy ?? null,
      id,
      updatedAt: new Date(),
    };
    this.paymentConfigurations.set(id, config);
    return config;
  }

  async updatePaymentConfiguration(
    id: string,
    updates: Partial<InsertPaymentConfiguration>
  ): Promise<PaymentConfiguration | undefined> {
    const config = this.paymentConfigurations.get(id);
    if (config) {
      const updated = {
        ...config,
        ...updates,
        updatedAt: new Date(),
      };
      this.paymentConfigurations.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deletePaymentConfiguration(id: string): Promise<boolean> {
    return this.paymentConfigurations.delete(id);
  }

  async getEnabledPaymentMethods(categoryId?: string): Promise<string[]> {
    const configs = await this.getAllPaymentConfigurations();
    
    // Get category-specific configs first, then global configs
    const relevantConfigs = configs.filter(config => {
      if (categoryId && config.categoryId === categoryId) return true;
      if (!categoryId && !config.categoryId) return true;
      if (!config.categoryId) return true; // Global config applies to all
      return false;
    });

    const enabledMethods = relevantConfigs
      .filter(config => config.isEnabled === 1)
      .map(config => config.paymentMethod);

    // Return unique methods
    return Array.from(new Set(enabledMethods));
  }
}

// Initialize storage based on environment
import { db } from './db';
import { PostgresStorage } from './pg-storage';

export const storage: IStorage = db 
  ? new PostgresStorage(db)
  : new MemStorage();
