import { updateTodo } from '../models/updateTodo';

export const updateTodolist = async (c: any) => {
    const idParam = c.req.param('id');
    if (!idParam) {
        return c.json({ error: 'ID is required' }, 400);
    }
    const index = parseInt(idParam, 10);
    if (isNaN(index) || index < 0) {
        return c.json({ error: 'Invalid ID' }, 400);
    }
    const { task } = await c.req.json();
    if (!task?.trim()) {
        return c.json({ error: 'Task is required' }, 400);
    }
    try {
        await updateTodo(index, task.trim());
        return c.json({ message: 'Task updated successfully' }, 200);
    } catch (error) {
        console.error('Error updating task:', error);
        return c.json({ error: 'Failed to update task' }, 500);
    }
};
