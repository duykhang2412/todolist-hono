import { getTodos, deleteTodo } from '../models/todoModel';

export const deleteTodolist = async (c: any) => {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id) || id < 0) {
        return c.json({ error: 'Invalid ID' }, 400);
    }
    try {
        const todos = await getTodos();
        if (id >= todos.length) {
            return c.json({ error: 'Task not found' }, 404);
        }
        await deleteTodo(id);
        return c.json({ message: 'Task deleted successfully' }, 200);
    } catch (error) {
        console.error('Error deleting task:', error);
        return c.json({ error: 'Failed to delete task' }, 500);
    }
};
