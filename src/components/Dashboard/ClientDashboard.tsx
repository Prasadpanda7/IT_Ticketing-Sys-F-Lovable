
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import TicketCard from '@/components/Tickets/TicketCard';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();
  
  const myTickets = tickets.filter(ticket => ticket.userId === user?.id);
  const openTickets = myTickets.filter(ticket => ticket.status === 'Open');
  const inProgressTickets = myTickets.filter(ticket => ticket.status === 'In Progress');
  const resolvedTickets = myTickets.filter(ticket => ['Resolved', 'Closed'].includes(ticket.status));

  const recentTickets = myTickets.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome, {user?.username}</h2>
        <p className="text-gray-600">Here's an overview of your support tickets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTickets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{openTickets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgressTickets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedTickets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Tickets</h3>
        {recentTickets.length > 0 ? (
          <div className="grid gap-4">
            {recentTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tickets found. Create your first ticket to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
