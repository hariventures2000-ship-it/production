import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select } from '@hariventure/ui';
import { useTaskStore } from '@/store/task.store';
import { useProjectStore } from '@/store/project.store';
import { TaskPriority, TaskType } from '@hariventure/types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function CreateTaskModal({ isOpen, onClose, defaultProjectId }: CreateTaskModalProps) {
  const { createTask, isLoading } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, fetchProjects]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: defaultProjectId || '',
    priority: 'MEDIUM' as TaskPriority,
    type: 'FEATURE' as TaskType,
    storyPoints: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await createTask({
        ...formData,
        storyPoints: Number(formData.storyPoints),
        status: 'TODO'
      } as Parameters<typeof createTask>[0]);
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string | string[] } } };
      setErrorMsg(err.response?.data?.message?.toString() || 'Failed to create task');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <div className="text-red-500 text-sm mb-4">{errorMsg}</div>}
        
        <Input
          label="Task Title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Implement OAuth2 Login"
        />

        <Select 
          label="Project" 
          name="projectId" 
          required
          value={formData.projectId} 
          onChange={handleChange}
        >
          <option value="" disabled>Select a Project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Type" 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
          >
            {Object.values(TaskType).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>

          <Select 
            label="Priority" 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
          >
            {Object.values(TaskPriority).map(prio => (
              <option key={prio} value={prio}>{prio}</option>
            ))}
          </Select>
        </div>

        <Input
          label="Story Points"
          name="storyPoints"
          type="number"
          min="0"
          required
          value={formData.storyPoints}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
