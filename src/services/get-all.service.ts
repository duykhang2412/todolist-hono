import { getTodos } from '../models/todoModel';

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
