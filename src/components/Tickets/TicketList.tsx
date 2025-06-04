
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import TicketCard from './TicketCard';
import { Ticket } from '@/types';

interface TicketListProps {
  showAllTickets?: boolean;
}

const TicketList = ({ showAllTickets = false }: TicketListProps) => {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter tickets based on user role
  const userTickets = showAllTickets 
    ? tickets 
    : tickets.filter(ticket => ticket.userId === user?.id);

  // Apply filters
  const filteredTickets = userTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || ticket.issueType === typeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {showAllTickets ? 'All Tickets' : 'My Tickets'}
        </h2>
        <p className="text-gray-600">
          {showAllTickets 
            ? 'Manage and track all support tickets in the system'
            : 'View and track your submitted support tickets'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Network">Network</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-600">
          <Filter className="h-4 w-4 mr-2" />
          Showing {filteredTickets.length} of {userTickets.length} tickets
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              showUser={showAllTickets}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : showAllTickets 
                  ? 'No tickets have been created yet'
                  : 'You haven\'t created any tickets yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
