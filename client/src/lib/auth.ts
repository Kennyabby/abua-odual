import { User } from "@shared/schema";

// Demo users for login dropdown (passwords are NOT used here - actual auth via API)
// Passwords are bcrypt hashed in the backend database
// For demo/testing credentials, see server/seed.ts or DEPLOYMENT.md
export const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "citizen1",
    password: "", // Hashed in backend - not used client-side
    fullName: "John Okafor",
    email: "john.okafor@email.com",
    phone: "+234 803 123 4567",
    role: "citizen",
  },
  {
    id: "2",
    username: "admin1",
    password: "", // Hashed in backend - not used client-side
    fullName: "Ada Nwosu",
    email: "ada.nwosu@abuaodual.gov.ng",
    phone: "+234 805 987 6543",
    role: "admin",
  },
  {
    id: "3",
    username: "finance1",
    password: "", // Hashed in backend - not used client-side
    fullName: "Emeka Eze",
    email: "emeka.eze@abuaodual.gov.ng",
    phone: "+234 807 234 5678",
    role: "finance_officer",
  },
  {
    id: "4",
    username: "auditor1",
    password: "", // Hashed in backend - not used client-side
    fullName: "Ngozi Obi",
    email: "ngozi.obi@abuaodual.gov.ng",
    phone: "+234 809 876 5432",
    role: "auditor",
  },
];

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
}

export function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    citizen: "Citizen",
    admin: "Administrator",
    finance_officer: "Finance Officer",
    auditor: "Auditor",
  };
  return labels[role] || role;
}
