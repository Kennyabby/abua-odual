import { db } from './db';
import {
  users,
  taxpayers,
  revenueCategories,
  invoices,
  payments,
  businessRegistrations,
  paymentConfigurations,
} from '@shared/schema';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Demo Data Seed Script
// Generates random passwords for demo accounts on each run
// Passwords are bcrypt hashed in database, plaintext logged to console only
// ⚠️  WARNING: Demo accounts should be DELETED before production deployment

function generatePassword(): string {
  // Generate a secure random password
  return randomBytes(16).toString('base64').slice(0, 16);
}

async function seed() {
  if (!db) {
    console.error('DATABASE_URL not set. Cannot seed database.');
    process.exit(1);
  }

  console.log('Seeding database with demo data...');
  console.log('');
  console.log('🔐 Generating random passwords for demo accounts...');
  console.log('');

  // Generate random passwords for demo accounts
  const passwords = {
    citizen1: generatePassword(),
    admin1: generatePassword(),
    finance1: generatePassword(),
    auditor1: generatePassword(),
  };

  // Hash all passwords
  const hashedPasswords = {
    citizen1: await bcrypt.hash(passwords.citizen1, 10),
    admin1: await bcrypt.hash(passwords.admin1, 10),
    finance1: await bcrypt.hash(passwords.finance1, 10),
    auditor1: await bcrypt.hash(passwords.auditor1, 10),
  };

  // Output credentials to console
  console.log('⚠️  DEMO CREDENTIALS (save these for testing):');
  console.log('═════════════════════════════════════════════');
  console.log(`   Citizen:  username: citizen1  password: ${passwords.citizen1}`);
  console.log(`   Admin:    username: admin1    password: ${passwords.admin1}`);
  console.log(`   Finance:  username: finance1  password: ${passwords.finance1}`);
  console.log(`   Auditor:  username: auditor1  password: ${passwords.auditor1}`);
  console.log('═════════════════════════════════════════════');
  console.log('');

  // Optionally write to gitignored file for convenience
  try {
    const credentialsOutput = `# Demo Account Credentials
# Generated: ${new Date().toISOString()}
# ⚠️  THIS FILE IS AUTO-GENERATED AND .GITIGNORED
# These credentials are ONLY for testing this deployment
# DELETE demo accounts before production use

Citizen Account:
  Username: citizen1
  Password: ${passwords.citizen1}
  Email: john.okafor@email.com

Administrator Account:
  Username: admin1
  Password: ${passwords.admin1}
  Email: ada.nwosu@abuaodual.gov.ng

Finance Officer Account:
  Username: finance1
  Password: ${passwords.finance1}
  Email: emeka.eze@abuaodual.gov.ng

Auditor Account:
  Username: auditor1
  Password: ${passwords.auditor1}
  Email: ngozi.obi@abuaodual.gov.ng
`;
    writeFileSync(join(process.cwd(), 'demo-passwords.txt'), credentialsOutput);
    console.log('✅ Credentials also saved to demo-passwords.txt (git-ignored)');
    console.log('');
  } catch (err) {
    console.log('⚠️  Could not write demo-passwords.txt file');
  }

  console.log('📊 Seeding users with hashed passwords...');
  await db.insert(users).values([
    {
      id: '1',
      username: 'citizen1',
      password: hashedPasswords.citizen1,
      fullName: 'John Okafor',
      email: 'john.okafor@email.com',
      phone: '+234 803 123 4567',
      role: 'citizen',
    },
    {
      id: '2',
      username: 'admin1',
      password: hashedPasswords.admin1,
      fullName: 'Ada Nwosu',
      email: 'ada.nwosu@abuaodual.gov.ng',
      phone: '+234 805 987 6543',
      role: 'admin',
    },
    {
      id: '3',
      username: 'finance1',
      password: hashedPasswords.finance1,
      fullName: 'Emeka Eze',
      email: 'emeka.eze@abuaodual.gov.ng',
      phone: '+234 807 234 5678',
      role: 'finance_officer',
    },
    {
      id: '4',
      username: 'auditor1',
      password: hashedPasswords.auditor1,
      fullName: 'Ngozi Obi',
      email: 'ngozi.obi@abuaodual.gov.ng',
      phone: '+234 809 876 5432',
      role: 'auditor',
    },
  ]).onConflictDoNothing();

  // Seed taxpayers
  console.log('Seeding taxpayers...');
  await db.insert(taxpayers).values([
    {
      id: 'tp1',
      taxpayerId: 'TAX-2024-001',
      type: 'individual',
      fullName: 'Chukwu Okonkwo',
      email: 'chukwu.okonkwo@email.com',
      phone: '+234 803 111 2222',
      address: '15 Market Road, Abua',
    },
    {
      id: 'tp2',
      taxpayerId: 'TAX-2024-002',
      type: 'business',
      fullName: 'Grace Amadi',
      email: 'grace.amadi@business.com',
      phone: '+234 805 333 4444',
      address: '22 Commercial Avenue, Odual',
      businessName: 'Amadi Trading Company',
      businessType: 'limited_liability',
      registrationNumber: 'RC-2024-8765',
    },
  ]).onConflictDoNothing();

  // Seed revenue categories
  console.log('Seeding revenue categories...');
  await db.insert(revenueCategories).values([
    {
      id: 'cat1',
      name: 'Business Permit',
      description: 'Annual business operating permit',
      department: 'Commerce',
      amount: '25000.00',
      isActive: 1,
    },
    {
      id: 'cat2',
      name: 'Market Stall Fee',
      description: 'Monthly market stall rental',
      department: 'Market',
      amount: '5000.00',
      isActive: 1,
    },
    {
      id: 'cat3',
      name: 'Building Permit',
      description: 'Residential/commercial building approval',
      department: 'Planning',
      amount: '50000.00',
      isActive: 1,
    },
  ]).onConflictDoNothing();

  // Seed invoices
  console.log('Seeding invoices...');
  await db.insert(invoices).values([
    {
      id: 'inv1',
      invoiceNumber: 'INV-2024-0001',
      taxpayerId: 'tp1',
      categoryId: 'cat1',
      amount: '25000.00',
      status: 'pending',
      dueDate: new Date('2025-01-15'),
      description: 'Business permit renewal - 2025',
    },
    {
      id: 'inv2',
      invoiceNumber: 'INV-2024-0002',
      taxpayerId: 'tp2',
      categoryId: 'cat2',
      amount: '5000.00',
      status: 'paid',
      dueDate: new Date('2024-12-01'),
      description: 'Market stall - December 2024',
    },
  ]).onConflictDoNothing();

  // Seed payments
  console.log('Seeding payments...');
  await db.insert(payments).values([
    {
      id: 'pay1',
      rrr: 'RRR-240001234567',
      invoiceId: 'inv2',
      taxpayerId: 'tp2',
      amount: '5000.00',
      paymentMethod: 'card',
      status: 'successful',
      payerName: 'Grace Amadi',
      payerEmail: 'grace.amadi@business.com',
      payerPhone: '+234 805 333 4444',
    },
  ]).onConflictDoNothing();

  // Seed payment configurations (global defaults)
  console.log('Seeding payment configurations...');
  await db.insert(paymentConfigurations).values([
    {
      paymentMethod: 'card',
      categoryId: null,
      isEnabled: 1,
      updatedBy: null,
    },
    {
      paymentMethod: 'bank_transfer',
      categoryId: null,
      isEnabled: 1,
      updatedBy: null,
    },
    {
      paymentMethod: 'ussd',
      categoryId: null,
      isEnabled: 1,
      updatedBy: null,
    },
    {
      paymentMethod: 'mobile_money',
      categoryId: null,
      isEnabled: 0,
      updatedBy: null,
    },
  ]).onConflictDoNothing();

  console.log('Database seeding completed!');
}

seed()
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
