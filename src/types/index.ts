
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'client' | 'admin';
  department?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  issueType: 'Hardware' | 'Software' | 'Network' | 'Others';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  userId: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  resolutionNotes?: string;
}

export interface TicketLog {
  id: string;
  ticketId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
