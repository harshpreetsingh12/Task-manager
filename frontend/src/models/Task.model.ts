export interface ITask {
   _id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  taskDate: Date;
}

export type CreateTaskDTO = {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  taskDate: string;
};
