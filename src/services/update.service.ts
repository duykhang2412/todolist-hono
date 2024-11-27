// services/update-todo-list.service.ts
import { updateTodo } from '../models/todoModel';

export const updateTodolist = async (c: any) => {
    const index = parseInt(c.req.param('index'), 10);
    const { task } = await c.req.json();

    // Kiểm tra tính hợp lệ của chỉ mục
    if (isNaN(index) || index < 0) {
        return c.json({ error: 'Invalid index' }, 400); // Trả về 400 nếu index không hợp lệ
    }

    // Kiểm tra xem task có hợp lệ không
    if (!task || task.trim() === '') {
        return c.json({ error: 'Task is required' }, 400); // Trả về 400 nếu task không hợp lệ
    }

    try {
        // Cập nhật task
        await updateTodo(index, task);  // Không cần trả về result ở đây
        return c.json({ message: 'Task updated successfully' }, 200); // Trả về 200 OK khi thành công
    } catch (error: unknown) {
        console.error('Error updating task:', error);

        if (error instanceof Error) {
            return c.json({ error: error.message || 'Failed to update task' }, 500); // Trả về 500 nếu có lỗi hệ thống
        } else {
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }
};
