import { getById, getTodos } from '../models/getTodo';

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

export const getAllTodolist = async (c: any) => {
    try {
        const page = parseInt(c.req.query('page') || '1', 10);
        const limit = parseInt(c.req.query('limit') || '3', 10);

        if (page <= 0 || limit <= 0) {
            return c.json({ error: 'Page and limit must be positive integers' }, 400);
        }

        const todos = await getTodos();
        const totalItems = todos.length;
        const totalPages = Math.ceil(totalItems / limit);
        const paginatedTodos = todos.slice((page - 1) * limit, page * limit);

        return c.json({ todos: paginatedTodos, totalItems, totalPages, currentPage: page });
    } catch (error) {
        console.error('Error fetching todos:', error);
        return c.json({ error: 'Failed to fetch todos' }, 500);
    }
};
