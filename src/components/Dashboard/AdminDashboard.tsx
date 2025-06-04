
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Clock, CheckCircle, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { useTickets } from '@/contexts/TicketContext';
import TicketCard from '@/components/Tickets/TicketCard';

const AdminDashboard = () => {
  const { tickets } = useTickets();
  
  const openTickets = tickets.filter(ticket => ticket.status === 'Open');
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'In Progress');
  const resolvedTickets = tickets.filter(ticket => ['Resolved', 'Closed'].includes(ticket.status));
  const highPriorityTickets = tickets.filter(ticket => ticket.priority === 'High');

  const recentTickets = tickets.slice(0, 4);

  // Calculate some basic analytics
  const issueTypeStats = tickets.reduce((acc, ticket) => {
    acc[ticket.issueType] = (acc[ticket.issueType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Monitor and manage all support tickets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriorityTickets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(tickets.map(t => t.userId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Issue Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(issueTypeStats).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / tickets.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium truncate max-w-48">{ticket.subject}</p>
                    <p className="text-gray-500">{ticket.issueType} • {ticket.priority}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                    ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Tickets</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recentTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} showUser={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
