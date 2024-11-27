// src/services/get.service.ts
import { getById } from '../models/todoModel';  // Import hàm getById từ models

export const getTodolist = async (c: any) => {
    const id = parseInt(c.req.param('id'), 10);  // Lấy id từ URL params

    // Kiểm tra tính hợp lệ của id
    if (isNaN(id) || id < 0) {
        return c.json({ error: 'Invalid ID' }, 400);  // Trả về lỗi nếu ID không hợp lệ
    }

    try {
        // Lấy TODO theo ID
        const todo = await getById(id);
        return c.json({ todo });  // Trả về TODO item theo ID
    } catch (error: unknown) {
        console.error('Error fetching todo by ID:', error);
        return c.json({ error: 'Unable to fetch todo by ID' }, 500);  // Trả về lỗi nếu có vấn đề
    }
};
