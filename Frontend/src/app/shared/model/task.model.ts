export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt?: Date;
}
