import { deleteTodo } from '../models/deleteTodo';
import { getTodos } from '../models/getTodo'
export const deleteTodolist = async (c: any) => {
    try {
        // Lấy danh sách ID từ URL param `:id` (phân tách bởi dấu phẩy)
        const idsParam = c.req.param('id');
        const ids = idsParam ? idsParam.split(',').map((id: string) => parseInt(id.trim(), 10)) : [];

        // Kiểm tra nếu danh sách ID rỗng hoặc có ID không hợp lệ
        if (ids.length === 0) {
            return c.json({ error: 'No IDs provided' }, 400);
        }

        const invalidIds = ids.filter((id: number) => isNaN(id) || id < 0);
        if (invalidIds.length > 0) {
            return c.json({
                error: 'Invalid ID(s) provided',
                invalidIds,
            }, 400);
        }

        // Lấy danh sách todos hiện tại từ Redis
        const todos = await getTodos();

        // Kiểm tra ID nào vượt quá phạm vi danh sách
        const outOfRangeIds = ids.filter((id: number) => id >= todos.length);
        if (outOfRangeIds.length > 0) {
            return c.json({
                error: 'Some IDs do not exist in the database',
                invalidIds: outOfRangeIds,
            }, 404);
        }

        // Xóa các Todo theo ID
        for (const id of ids) {
            await deleteTodo(id);
        }

        // Tùy chỉnh phản hồi dựa trên số lượng ID được xóa
        if (ids.length === 1) {
            return c.json({ message: 'Task deleted successfully' }, 200);
        }

        return c.json({ message: 'Tasks deleted successfully', deletedIds: ids }, 200);
    } catch (error) {
        console.error('Error deleting task(s):', error);
        return c.json({ error: 'Failed to delete task(s)' }, 500);
    }
};
