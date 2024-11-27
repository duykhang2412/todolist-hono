// services/delete-todo-list.service.ts
import { getTodos, deleteTodo } from '../models/todoModel';

export const deleteTodolist = async (c: any) => {
    const index = parseInt(c.req.param('index'), 10);

    // Kiểm tra tính hợp lệ của chỉ mục
    if (isNaN(index) || index < 0) {
        return c.json({ error: 'Invalid index' }, 400); // Trả về 400 nếu index không hợp lệ
    }

    try {
        // Kiểm tra xem task có tồn tại không trước khi xóa
        const todos = await getTodos();  // Lấy danh sách todos
        if (index >= todos.length) {
            return c.json({ error: 'Task not found' }, 404);  // Trả về 404 nếu không tìm thấy task
        }

        // Xóa task
        await deleteTodo(index);
        return c.json({ message: 'Task deleted successfully' }, 200); // Trả về 200 OK khi xóa thành công
    } catch (error: unknown) {
        console.error('Error deleting task:', error);

        if (error instanceof Error) {
            return c.json({ error: error.message || 'Failed to delete task' }, 500); // Trả về 500 nếu có lỗi hệ thống
        } else {
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }
};
