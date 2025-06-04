
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, AlertCircle } from 'lucide-react';
import { Ticket } from '@/types';
import { cn } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  onViewDetails?: (ticket: Ticket) => void;
  showUser?: boolean;
}

const TicketCard = ({ ticket, onViewDetails, showUser = false }: TicketCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">{ticket.subject}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getPriorityColor(ticket.priority))}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {ticket.priority}
              </Badge>
              <Badge 
                variant="outline"
                className={cn("text-xs", getStatusColor(ticket.status))}
              >
                {ticket.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {ticket.issueType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {ticket.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(ticket.createdAt)}
            </div>
            {showUser && (
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                User #{ticket.userId}
              </div>
            )}
            {ticket.assignedToName && (
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                Assigned to {ticket.assignedToName}
              </div>
            )}
          </div>
          
          {onViewDetails && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewDetails(ticket)}
              className="h-8 px-3 text-xs"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
