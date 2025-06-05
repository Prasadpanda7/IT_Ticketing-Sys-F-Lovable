
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, TicketLog } from '@/types';

interface TicketContextType {
  tickets: Ticket[];
  logs: TicketLog[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  assignTicket: (id: string, assignedTo: string, assignedToName: string) => void;
  resolveTicket: (id: string, resolutionNotes?: string, resolvedBy?: string) => void;
  addLog: (log: Omit<TicketLog, 'id' | 'timestamp'>) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Computer won\'t start',
    description: 'My computer is not turning on when I press the power button. The LED light is not showing.',
    issueType: 'Hardware',
    priority: 'High',
    status: 'Open',
    userId: '1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    subject: 'Outlook email sync issues',
    description: 'Emails are not syncing properly in Outlook. Some emails from yesterday are missing.',
    issueType: 'Software',
    priority: 'Medium',
    status: 'In Progress',
    userId: '3',
    assignedTo: '2',
    assignedToName: 'Admin User',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    subject: 'Wi-Fi connection dropping',
    description: 'Internet connection keeps dropping every few minutes. Need to reconnect manually.',
    issueType: 'Network',
    priority: 'Medium',
    status: 'Open',
    userId: '1',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  }
];

export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [logs, setLogs] = useState<TicketLog[]>([]);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTickets(prev => [newTicket, ...prev]);
    
    addLog({
      ticketId: newTicket.id,
      action: 'Ticket Created',
      performedBy: ticketData.userId,
    });
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const assignTicket = (id: string, assignedTo: string, assignedToName: string) => {
    updateTicket(id, { assignedTo, assignedToName, status: 'In Progress' });
    
    addLog({
      ticketId: id,
      action: 'Ticket Assigned',
      performedBy: assignedTo,
      notes: `Assigned to ${assignedToName}`,
    });
  };

  const resolveTicket = (id: string, resolutionNotes?: string, resolvedBy?: string) => {
    updateTicket(id, { 
      status: 'Resolved', 
      resolutionNotes: resolutionNotes || 'Ticket resolved by admin'
    });
    
    addLog({
      ticketId: id,
      action: 'Ticket Resolved',
      performedBy: resolvedBy || 'admin',
      notes: resolutionNotes || 'Ticket marked as resolved',
    });
  };

  const addLog = (logData: Omit<TicketLog, 'id' | 'timestamp'>) => {
    const newLog: TicketLog = {
      ...logData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    setLogs(prev => [newLog, ...prev]);
  };

  const value = {
    tickets,
    logs,
    createTicket,
    updateTicket,
    assignTicket,
    resolveTicket,
    addLog,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
