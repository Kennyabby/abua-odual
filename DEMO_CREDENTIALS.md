# Demo Account Credentials

## 🔐 Runtime-Generated Passwords

This application generates **random, unique passwords** for demo accounts each time you run the seed script. Passwords are NEVER stored in the repository.

## Getting Demo Credentials

### Step 1: Run the Seed Script

```bash
# Ensure DATABASE_URL is set
npm run db:seed
```

### Step 2: Save the Credentials

The seed script outputs credentials to:
1. **Console output** - Displayed during seed (copy immediately)
2. **demo-passwords.txt** - Auto-generated file (git-ignored, for your convenience)

**Example output:**
```
⚠️  DEMO CREDENTIALS (save these for testing):
═════════════════════════════════════════════
   Citizen:  username: citizen1  password: Xy8kP2mN5qR7tVw4
   Admin:    username: admin1    password: Bv3nM9jL2fH6pQs8
   Finance:  username: finance1  password: Kw7dR4xT1yC8mZn3
   Auditor:  username: auditor1  password: Fp2qW6jM9vL5bNh7
═════════════════════════════════════════════
```

## Demo Account Roles

- **citizen1** - Citizen portal, invoices, payment history
- **admin1** - Full system access, all management features
- **finance1** - Revenue sources, invoices, payments, reports
- **auditor1** - Read-only access, reports only

## Resetting Passwords

### Option 1: Re-run Seed Script

```bash
npm run db:seed  # Generates new random passwords
```

### Option 2: Reset via API

```bash
# Reset a specific user's password
curl -X PUT https://your-api.com/api/users/2 \
  -H "Content-Type: application/json" \
  -d '{"password": "YourNewSecurePassword123!"}'
```

### Option 3: Create Your Own Test Account

```bash
curl -X POST https://your-api.com/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testadmin",
    "password": "SecurePassword123!",
    "fullName": "Test Administrator",
    "email": "test@example.com",
    "phone": "+234 800 000 0000",
    "role": "admin"
  }'
```

## ⚠️ PRODUCTION SECURITY

**Before deploying to production:**

1. **Delete ALL demo accounts:**
   ```sql
   DELETE FROM users WHERE username IN ('citizen1', 'admin1', 'finance1', 'auditor1');
   ```

2. **Create secure production accounts:**
   - Use strong, unique passwords (20+ characters)
   - Enable 2FA when available
   - Use non-predictable usernames
   - Implement password rotation policy

3. **Remove seed script access** - Don't expose seed endpoints in production

See `SECURITY.md` for comprehensive production security requirements.
