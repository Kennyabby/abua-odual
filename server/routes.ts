import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertTaxpayerSchema,
  insertRevenueCategorySchema,
  insertInvoiceSchema,
  insertPaymentSchema,
  updateInvoiceStatusSchema,
  insertBusinessRegistrationSchema,
  updateBusinessRegistrationStatusSchema,
  insertPaymentConfigurationSchema,
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password with hashed password
    // const validPassword = await bcrypt.compare(password, user.password);
    console.log('password: ',password, 'entered password:', user.password)
    const validPassword = password===user.password;
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Users
  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    // Don't send passwords in the response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      // Hash password if it's being updated
      if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, 10);
      }
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    const deleted = await storage.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    const payments = await storage.getAllPayments();
    const invoices = await storage.getAllInvoices();
    const taxpayers = await storage.getAllTaxpayers();

    const totalRevenue = payments
      .filter(p => p.status === "successful")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const successfulPayments = payments.filter(p => p.status === "successful").length;

    res.json({
      totalRevenue,
      totalInvoices: invoices.length,
      successfulPayments,
      totalTaxpayers: taxpayers.length,
    });
  });

  app.get("/api/dashboard/revenue-by-department", async (req, res) => {
    const categories = await storage.getAllRevenueCategories();
    const invoices = await storage.getAllInvoices();
    const payments = await storage.getAllPayments();

    const departmentRevenue: Record<string, number> = {};

    for (const invoice of invoices) {
      const payment = payments.find(p => p.invoiceId === invoice.id && p.status === "successful");
      if (payment) {
        const category = categories.find(c => c.id === invoice.categoryId);
        if (category) {
          const dept = category.department;
          departmentRevenue[dept] = (departmentRevenue[dept] || 0) + parseFloat(payment.amount);
        }
      }
    }

    const data = Object.entries(departmentRevenue).map(([department, amount]) => ({
      department: department.split(' ')[0],
      amount: Math.round(amount),
    }));

    res.json(data);
  });

  app.get("/api/dashboard/revenue-by-source", async (req, res) => {
    const categories = await storage.getAllRevenueCategories();
    const invoices = await storage.getAllInvoices();
    const payments = await storage.getAllPayments();

    const sourceRevenue: Record<string, number> = {};

    for (const invoice of invoices) {
      const payment = payments.find(p => p.invoiceId === invoice.id && p.status === "successful");
      if (payment) {
        const category = categories.find(c => c.id === invoice.categoryId);
        if (category) {
          sourceRevenue[category.name] = (sourceRevenue[category.name] || 0) + parseFloat(payment.amount);
        }
      }
    }

    const totalRevenue = Object.values(sourceRevenue).reduce((sum, val) => sum + val, 0);
    
    const data = Object.entries(sourceRevenue)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        percentage: Math.round((value / totalRevenue) * 100),
      }))
      .slice(0, 5);

    res.json(data);
  });

  app.get("/api/dashboard/monthly-trends", async (req, res) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const data = months.map((month, index) => ({
      month,
      revenue: Math.round(150000 + Math.random() * 100000 + (index * 20000)),
      payments: Math.round(25 + Math.random() * 15 + (index * 3)),
    }));

    res.json(data);
  });

  // Taxpayers
  app.get("/api/taxpayers", async (req, res) => {
    const taxpayers = await storage.getAllTaxpayers();
    res.json(taxpayers);
  });

  app.get("/api/taxpayers/:id", async (req, res) => {
    const taxpayer = await storage.getTaxpayer(req.params.id);
    if (!taxpayer) {
      return res.status(404).json({ error: "Taxpayer not found" });
    }
    res.json(taxpayer);
  });

  app.post("/api/taxpayers", async (req, res) => {
    try {
      const validatedData = insertTaxpayerSchema.parse(req.body);
      const taxpayer = await storage.createTaxpayer(validatedData);
      res.status(201).json(taxpayer);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/taxpayers/:id", async (req, res) => {
    try {
      const validatedData = insertTaxpayerSchema.partial().parse(req.body);
      const taxpayer = await storage.updateTaxpayer(req.params.id, validatedData);
      if (!taxpayer) {
        return res.status(404).json({ error: "Taxpayer not found" });
      }
      res.json(taxpayer);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/taxpayers/:id", async (req, res) => {
    const deleted = await storage.deleteTaxpayer(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Taxpayer not found" });
    }
    res.status(204).send();
  });

  // Revenue Categories
  app.get("/api/revenue-categories", async (req, res) => {
    const categories = await storage.getAllRevenueCategories();
    res.json(categories);
  });

  app.get("/api/revenue-categories/:id", async (req, res) => {
    const category = await storage.getRevenueCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  });

  app.post("/api/revenue-categories", async (req, res) => {
    try {
      const validatedData = insertRevenueCategorySchema.parse(req.body);
      const category = await storage.createRevenueCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/revenue-categories/:id", async (req, res) => {
    try {
      const validatedData = insertRevenueCategorySchema.partial().parse(req.body);
      const category = await storage.updateRevenueCategory(req.params.id, validatedData);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/revenue-categories/:id", async (req, res) => {
    const deleted = await storage.deleteRevenueCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(204).send();
  });

  // Invoices
  app.get("/api/invoices", async (req, res) => {
    const invoices = await storage.getAllInvoices();
    const taxpayers = await storage.getAllTaxpayers();
    const categories = await storage.getAllRevenueCategories();

    const enrichedInvoices = invoices.map(invoice => {
      const taxpayer = taxpayers.find(t => t.id === invoice.taxpayerId);
      const category = categories.find(c => c.id === invoice.categoryId);
      return {
        ...invoice,
        taxpayerName: taxpayer?.fullName || "Unknown",
        taxpayerEmail: taxpayer?.email || "",
        categoryName: category?.name || "Unknown",
      };
    });

    res.json(enrichedInvoices);
  });

  app.get("/api/invoices/:id", async (req, res) => {
    const invoice = await storage.getInvoice(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const validatedData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(validatedData);
      res.status(201).json(invoice);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/invoices/:id", async (req, res) => {
    try {
      const validatedData = updateInvoiceStatusSchema.parse(req.body);
      const invoice = await storage.updateInvoiceStatus(req.params.id, validatedData.status);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    const deleted = await storage.deleteInvoice(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(204).send();
  });

  // Payments
  app.get("/api/payments", async (req, res) => {
    const payments = await storage.getAllPayments();
    const invoices = await storage.getAllInvoices();

    const enrichedPayments = payments.map(payment => {
      const invoice = invoices.find(i => i.id === payment.invoiceId);
      return {
        ...payment,
        invoiceNumber: invoice?.invoiceNumber || "Unknown",
      };
    });

    res.json(enrichedPayments);
  });

  app.get("/api/payments/:id", async (req, res) => {
    const payment = await storage.getPayment(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json(payment);
  });

  app.put("/api/payments/:id", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(req.params.id, validatedData);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/payments/:id", async (req, res) => {
    const deleted = await storage.deletePayment(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(204).send();
  });

  // Process payment (mock)
  app.post("/api/payments/process", async (req, res) => {
    const { categoryId, amount, paymentMethod, payerName, payerEmail, payerPhone } = req.body;

    // Generate RRR
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const rrr = timestamp + random;

    // Create invoice first
    const category = await storage.getRevenueCategory(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find or create a taxpayer (in a real system, this would be the logged-in user)
    const taxpayers = await storage.getAllTaxpayers();
    let taxpayer = taxpayers.find(t => t.email === payerEmail);
    
    if (!taxpayer) {
      // Create a new taxpayer
      taxpayer = await storage.createTaxpayer({
        taxpayerId: `ABU-IND-${new Date().getFullYear()}-${(taxpayers.length + 1).toString().padStart(4, '0')}`,
        type: "individual",
        fullName: payerName,
        email: payerEmail,
        phone: payerPhone,
        address: "N/A",
        businessName: null,
        businessType: null,
        registrationNumber: null,
      });
    }

    const invoice = await storage.createInvoice({
      invoiceNumber: `INV-${new Date().getFullYear()}-${(await storage.getAllInvoices()).length + 1}`.padStart(15, '0'),
      taxpayerId: taxpayer.id,
      categoryId,
      amount,
      status: "paid",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: category.name,
    });

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create payment record
    const payment = await storage.createPayment({
      rrr,
      invoiceId: invoice.id,
      taxpayerId: taxpayer.id,
      amount,
      paymentMethod,
      status: "successful",
      payerName,
      payerEmail,
      payerPhone,
    });

    res.json({ rrr, payment });
  });

  // Verify payment by RRR
  app.post("/api/payments/verify", async (req, res) => {
    const { rrr } = req.body;
    const payment = await storage.getPaymentByRRR(rrr);

    if (!payment) {
      return res.json({ found: false });
    }

    const invoice = await storage.getInvoice(payment.invoiceId);
    
    res.json({
      found: true,
      ...payment,
      invoiceNumber: invoice?.invoiceNumber || "Unknown",
    });
  });

  // Reports
  app.get("/api/reports", async (req, res) => {
    const { reportType, department } = req.query;
    const payments = await storage.getAllPayments();
    const categories = await storage.getAllRevenueCategories();
    const invoices = await storage.getAllInvoices();

    const successfulPayments = payments.filter(p => p.status === "successful");
    const totalCollections = successfulPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalTransactions = payments.length;
    const successRate = payments.length > 0 
      ? Math.round((successfulPayments.length / payments.length) * 100) 
      : 0;

    // Generate breakdown
    const breakdown: { category: string; amount: number }[] = [];
    
    for (const invoice of invoices) {
      const payment = payments.find(p => p.invoiceId === invoice.id && p.status === "successful");
      if (payment) {
        const category = categories.find(c => c.id === invoice.categoryId);
        if (category) {
          if (department === "all" || department === category.department.toLowerCase()) {
            const existing = breakdown.find(b => b.category === category.name);
            if (existing) {
              existing.amount += parseFloat(payment.amount);
            } else {
              breakdown.push({
                category: category.name,
                amount: parseFloat(payment.amount),
              });
            }
          }
        }
      }
    }

    res.json({
      totalCollections: Math.round(totalCollections),
      totalTransactions,
      successRate,
      breakdown: breakdown.slice(0, 10),
    });
  });

  // Business Registrations (Public POST, Admin GET/PUT/DELETE)
  app.post("/api/business/register", async (req, res) => {
    try {
      const validatedData = insertBusinessRegistrationSchema.parse(req.body);
      const existing = await storage.getBusinessRegistrationByNumber(validatedData.registrationNumber);
      
      if (existing) {
        return res.status(400).json({ error: "Registration number already exists" });
      }

      const registration = await storage.createBusinessRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/business-registrations", async (req, res) => {
    const registrations = await storage.getAllBusinessRegistrations();
    res.json(registrations);
  });

  app.get("/api/admin/business-registrations/:id", async (req, res) => {
    const registration = await storage.getBusinessRegistration(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.json(registration);
  });

  app.put("/api/admin/business-registrations/:id/status", async (req, res) => {
    try {
      const validatedData = updateBusinessRegistrationStatusSchema.parse(req.body);
      const registration = await storage.updateBusinessRegistrationStatus(
        req.params.id,
        validatedData.status,
        validatedData.rejectionReason,
        req.body.reviewedBy
      );
      
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      res.json(registration);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/business-registrations/:id", async (req, res) => {
    const deleted = await storage.deleteBusinessRegistration(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Registration not found" });
    }
    res.status(204).send();
  });

  // Payment Configurations (Admin only)
  app.get("/api/admin/payment-configurations", async (req, res) => {
    const configs = await storage.getAllPaymentConfigurations();
    res.json(configs);
  });

  app.get("/api/payment-methods", async (req, res) => {
    const categoryId = req.query.categoryId as string | undefined;
    const enabledMethods = await storage.getEnabledPaymentMethods(categoryId);
    res.json({ methods: enabledMethods });
  });

  app.post("/api/admin/payment-configurations", async (req, res) => {
    try {
      const validatedData = insertPaymentConfigurationSchema.parse(req.body);
      const config = await storage.createPaymentConfiguration(validatedData);
      res.status(201).json(config);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/payment-configurations/:id", async (req, res) => {
    try {
      const validatedData = insertPaymentConfigurationSchema.partial().parse(req.body);
      const config = await storage.updatePaymentConfiguration(req.params.id, validatedData);
      
      if (!config) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      
      res.json(config);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/payment-configurations/:id", async (req, res) => {
    const deleted = await storage.deletePaymentConfiguration(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Configuration not found" });
    }
    res.status(204).send();
  });

  const httpServer = createServer(app);

  return httpServer;
}
