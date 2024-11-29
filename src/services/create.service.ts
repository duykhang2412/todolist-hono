import { addTodo } from '../models/createTodo';

export const createTodolist = async (c: any) => {
    try {
        const body = await c.req.json();
        if (!body?.task) {
            return c.json({ error: 'Task is required' }, 400);
        }
        await addTodo(body.task.trim());
        return c.json({ message: 'Task added successfully' }, 201);
    } catch (error) {
        console.error('Error adding task:', error);
        return c.json({ error: 'Failed to add task' }, 500);
    }
};
