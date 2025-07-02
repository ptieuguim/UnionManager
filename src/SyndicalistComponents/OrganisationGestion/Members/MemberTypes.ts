// --- TypeScript Interfaces for Member Management ---

export interface PaymentHistoryEntry {
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | string;
}

export interface Member {
  comment: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  avatar?: string;
  status: 'active' | 'blocked' | 'pending';
  joinDate: string;
  role: string;
  profession: string;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  lastPayment: string | null;
  paymentHistory: PaymentHistoryEntry[];
  totalPaid: number;
  dueAmount: number;
  nextPaymentDate?: string;
}

export interface MembershipRequest {
  id: number;
  name: string;
  email: string;
  profilePic?: string;
  motivation: string;
  idCardFront?: string;
  idCardBack?: string;
  phone: string;
  profession: string;
  dateSubmitted: string;
}
