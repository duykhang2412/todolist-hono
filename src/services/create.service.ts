// services/create-todo-list.service.ts
import { addTodo } from '../models/todoModel'; // Thêm dòng này để import hàm addTodo từ models

export const createTodolist = async (c: any) => {
    try {
        // Lấy body từ yêu cầu
        const body = await c.req.json();

        // Kiểm tra nếu body không có task
        if (!body || !body.task) {
            return c.json({ error: 'Task is required' }, 400);
        }

        // Gọi hàm addTodo để thêm task
        await addTodo(body.task);
        return c.json({ message: 'Task added successfully' }, 201);
    } catch (error: unknown) {
        console.error('Error adding task:', error);
        return c.json({ error: 'Failed to add task' }, 500);
    }
};

