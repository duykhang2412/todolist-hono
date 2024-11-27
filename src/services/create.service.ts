// services/create-todo-list.service.ts
import { addTodo } from '../models/todoModel'; // Thêm dòng này để import hàm addTodo từ models

export const createTodolist = async (c: any) => {
    try {
        const { task } = await c.req.json();
        if (!task) return c.json({ error: 'Task is required' }, 400);

        // Logic thêm task vào danh sách (gọi hàm addTodo từ models)
        await addTodo(task);
        return c.json({ message: 'Task added successfully' });
    } catch (error: unknown) {
        console.error('Error adding task:', error);
        return c.json({ error: 'Failed to add task' }, 500);
    }
};
