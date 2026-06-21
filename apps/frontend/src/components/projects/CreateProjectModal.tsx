import React, { useState } from 'react';
import { Modal, Input, Button, Select } from '@hariventure/ui';
import { useProjectStore } from '@/store/project.store';
import { Department, ProjectPriority } from '@hariventure/types';
import { useAuthStore } from '@/store/auth.store';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { createProject, isLoading } = useProjectStore();
  const { user } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    department: 'WEBSITE_DEVELOPMENT' as Department,
    priority: 'MEDIUM' as ProjectPriority,
    startDate: '',
    estimatedEndDate: '',
    budget: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await createProject({
        ...formData,
        budget: Number(formData.budget),
        clientId: user?.userId || '60d5ecb54cb7c1a3b8d4f7a1', // Use real user ID, fallback to mock ObjectId
        status: 'PLANNING',
        completionPercentage: 0,
        actualCost: 0
      } as Parameters<typeof createProject>[0]);
      onClose(); // Close modal on success
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string | string[] } } };
      setErrorMsg(err.response?.data?.message?.toString() || 'Failed to create project');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <div className="text-red-500 text-sm mb-4">{errorMsg}</div>}
        
        <Input
          label="Project Name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Corporate Website Redesign"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Department" 
            name="department" 
            value={formData.department} 
            onChange={handleChange}
          >
            {Object.values(Department).map(dept => (
              <option key={dept} value={dept}>{dept.replace('_', ' ')}</option>
            ))}
          </Select>

          <Select 
            label="Priority" 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
          >
            {Object.values(ProjectPriority).map(prio => (
              <option key={prio} value={prio}>{prio}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            required
            value={formData.startDate}
            onChange={handleChange}
          />
          <Input
            label="Estimated End Date"
            name="estimatedEndDate"
            type="date"
            required
            value={formData.estimatedEndDate}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Budget (USD)"
          name="budget"
          type="number"
          min="0"
          required
          value={formData.budget}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
