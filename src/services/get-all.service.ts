import { getTodos } from '../models/todoModel';

export const getAllTodolist = async (c: any) => {
    try {
        // Lấy query parameters `page` và `limit` từ request
        const page = parseInt(c.req.query('page') || '1', 10);
        const limit = parseInt(c.req.query('limit') || '3', 10);

        if (page <= 0 || limit <= 0) {
            return c.json({ error: 'Page and limit must be positive integers' }, 400);
        }

        // Lấy tất cả todos từ Redis
        const todos = await getTodos();

        if (!todos || todos.length === 0) {
            return c.json({
                todos: [],
                totalItems: 0,
                totalPages: 0,
                currentPage: page,
            });
        }

        const totalTodos = todos.length; // Tổng số todos

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedTodos = todos.slice(startIndex, endIndex);

        return c.json({
            todos: paginatedTodos,
            totalItems: totalTodos,
            totalPages: Math.ceil(totalTodos / limit), // Tính tổng số trang
            currentPage: page,
        });
    } catch (error: unknown) {
        console.error('Error fetching todos with pagination:', error);
        return c.json({ error: 'Unable to fetch todos' }, 500);
    }
};
