
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
  refreshTickets: () => void;
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
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    // Try to load tickets from localStorage on initialization
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : mockTickets;
  });
  
  const [logs, setLogs] = useState<TicketLog[]>(() => {
    // Try to load logs from localStorage on initialization
    const savedLogs = localStorage.getItem('ticketLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
    console.log('Tickets saved to localStorage:', tickets);
  }, [tickets]);

  // Save logs to localStorage whenever logs change
  useEffect(() => {
    localStorage.setItem('ticketLogs', JSON.stringify(logs));
    console.log('Logs saved to localStorage:', logs);
  }, [logs]);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTickets(prev => {
      const updated = [newTicket, ...prev];
      console.log('Ticket created:', newTicket);
      return updated;
    });
    
    addLog({
      ticketId: newTicket.id,
      action: 'Ticket Created',
      performedBy: ticketData.userId,
    });
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => {
      const updated = prev.map(ticket => 
        ticket.id === id 
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      );
      console.log('Ticket updated:', { id, updates });
      return updated;
    });
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
    const updates = { 
      status: 'Resolved' as const, 
      resolutionNotes: resolutionNotes || 'Ticket resolved by admin'
    };
    
    updateTicket(id, updates);
    
    addLog({
      ticketId: id,
      action: 'Ticket Resolved',
      performedBy: resolvedBy || 'admin',
      notes: resolutionNotes || 'Ticket marked as resolved',
    });

    console.log('Ticket resolved:', { id, updates });
  };

  const addLog = (logData: Omit<TicketLog, 'id' | 'timestamp'>) => {
    const newLog: TicketLog = {
      ...logData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    setLogs(prev => {
      const updated = [newLog, ...prev];
      console.log('Log added:', newLog);
      return updated;
    });
  };

  const refreshTickets = () => {
    // Force re-render and reload from localStorage if needed
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
    console.log('Tickets refreshed');
  };

  const value = {
    tickets,
    logs,
    createTicket,
    updateTicket,
    assignTicket,
    resolveTicket,
    addLog,
    refreshTickets,
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
