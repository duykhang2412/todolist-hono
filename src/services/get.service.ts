import { getById } from '../models/todoModel';

export const getTodolist = async (c: any) => {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id) || id < 0) {
        return c.json({ error: 'Invalid ID' }, 400);
    }
    try {
        const todo = await getById(id);
        return c.json({ todo }, 200);
    } catch (error) {
        console.error('Error fetching todo:', error);
        return c.json({ error: 'Failed to fetch todo' }, 500);
    }
};
