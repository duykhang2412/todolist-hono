// src/services/get-all.service.ts
import { getTodos } from '../models/todoModel';  // Đảm bảo rằng tên và đường dẫn đúng

export const getAllTodolist = async (c: any) => {
    try {
        const todos = await getTodos();  // Lấy tất cả các TODO items
        return c.json({ todos });  // Trả về danh sách TODOs dưới dạng JSON
    } catch (error: unknown) {
        console.error('Error fetching all todos:', error);
        return c.json({ error: 'Unable to fetch todos' }, 500);  // Trả về lỗi nếu không thể lấy dữ liệu
    }
};