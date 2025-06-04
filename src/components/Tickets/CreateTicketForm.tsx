
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { toast } from 'sonner';

const CreateTicketForm = () => {
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    issueType: '',
    priority: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description || !formData.issueType || !formData.priority) {
      toast.error('Please fill in all required fields');
      return;
    }

    createTicket({
      subject: formData.subject,
      description: formData.description,
      issueType: formData.issueType as any,
      priority: formData.priority as any,
      status: 'Open',
      userId: user!.id,
      attachments: attachments.map(file => file.name),
    });

    toast.success('Ticket created successfully!');
    
    // Reset form
    setFormData({
      subject: '',
      description: '',
      issueType: '',
      priority: '',
    });
    setAttachments([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Support Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the issue"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Issue Type *</Label>
                <Select 
                  value={formData.issueType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, issueType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority *</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload screenshots or relevant files
                </p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm">
                    Choose Files
                  </Button>
                </Label>
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Ticket
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicketForm;
