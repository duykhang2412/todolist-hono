import { getTodos, deleteTodo } from '../models/todoModel';

export const deleteTodolist = async (c: any) => {
    const id = parseInt(c.req.param('id'), 10); // Đồng bộ với tham số trong routes

    // Kiểm tra tính hợp lệ của ID
    if (isNaN(id) || id < 0) {
        return c.json({ error: 'Invalid ID' }, 400); // Trả về lỗi nếu ID không hợp lệ
    }

    try {
        // Lấy danh sách todos
        const todos = await getTodos();
        if (!todos || todos.length === 0) {
            return c.json({ error: 'No tasks found' }, 404); // Không có task nào để xóa
        }

        if (id >= todos.length) {
            return c.json({ error: 'Task not found' }, 404); // ID vượt quá danh sách
        }

        // Xóa task
        await deleteTodo(id);
        return c.json({ message: 'Task deleted successfully' }, 200); // Thành công
    } catch (error: unknown) {
        console.error('Error deleting task:', error);

        // Xử lý lỗi
        if (error instanceof Error) {
            return c.json({ error: error.message || 'Failed to delete task' }, 500);
        } else {
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }
};
