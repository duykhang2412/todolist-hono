import { updateTodo } from '../models/todoModel';
import { Context } from 'hono';

export const updateTodolist = async (c: Context) => {
    try {
        // Lấy tham số `id` từ URL
        const idParam = c.req.param('id');
        if (!idParam) {
            console.error('ID is missing in the URL');
            return c.json({ error: 'ID is required in the URL' }, 400);
        }

        // Chuyển đổi `id` sang số nguyên
        const index = parseInt(idParam, 10);
        if (isNaN(index) || index < 0) {
            console.error('Invalid ID:', idParam);
            return c.json({ error: 'Invalid ID' }, 400);
        }

        // Lấy thông tin task từ request body
        const { task } = await c.req.json();
        if (!task || task.trim() === '') {
            console.error('Invalid task:', task);
            return c.json({ error: 'Task is required' }, 400);
        }

        // Loại bỏ khoảng trắng thừa trong task
        const trimmedTask = task.trim();

        // Gọi hàm updateTodo để cập nhật
        await updateTodo(index, trimmedTask);

        // Trả về phản hồi thành công
        return c.json({ message: 'Task updated successfully' }, 200);
    } catch (error: unknown) {
        // Xử lý lỗi hệ thống
        console.error('Error updating task:', error);

        if (error instanceof Error) {
            return c.json({ error: error.message || 'Failed to update task' }, 500);
        }
        return c.json({ error: 'Unknown error occurred' }, 500);
    }
};
