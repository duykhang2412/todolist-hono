import { getTodos, deleteTodo } from '../models/todoModel';

export const deleteTodolist = async (c: any) => {
    try {
        // Lấy danh sách ID từ URL param `:id` (phân tách bởi dấu phẩy)
        const idsParam = c.req.param('id');
        const ids = idsParam ? idsParam.split(',').map((id: string) => parseInt(id.trim(), 10)) : [];

        // Kiểm tra nếu danh sách ID rỗng hoặc có ID không hợp lệ
        const invalidFormatIds = ids.filter((id: number) => isNaN(id) || id < 0);
        if (ids.length === 0 || invalidFormatIds.length > 0) {
            return c.json({
                error: 'Invalid ID(s) provided',
                invalidIds: invalidFormatIds
            }, 400);
        }

        // Lấy danh sách todos hiện tại từ Redis
        const todos = await getTodos();

        // Lọc các ID không tồn tại trong danh sách Todo
        const invalidIds = ids.filter((id: number) => id >= todos.length);
        if (invalidIds.length > 0) {
            return c.json({
                error: 'Some IDs do not exist in the database',
                invalidIds: invalidIds
            }, 400);
        }

        // Xóa các Todo theo ID
        for (const id of ids) {
            await deleteTodo(id);
        }

        return c.json({ message: 'Tasks deleted successfully', deletedIds: ids }, 200);
    } catch (error) {
        console.error('Error deleting task(s):', error);
        return c.json({ error: 'Failed to delete task(s)' }, 500);
    }
};
