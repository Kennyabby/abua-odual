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
  type InsertPayment
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private taxpayers: Map<string, Taxpayer>;
  private revenueCategories: Map<string, RevenueCategory>;
  private invoices: Map<string, Invoice>;
  private payments: Map<string, Payment>;

  constructor() {
    this.users = new Map();
    this.taxpayers = new Map();
    this.revenueCategories = new Map();
    this.invoices = new Map();
    this.payments = new Map();
    
    this.seedMockData();
  }

  private seedMockData() {
    // Seed users
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
    const category: RevenueCategory = { ...insertCategory, id };
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
}

export const storage = new MemStorage();
