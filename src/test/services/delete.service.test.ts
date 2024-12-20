import { deleteTodolist } from 'src/services/delete.service';
import { redis } from 'src/models/todoModel'; // Kết nối Redis thực tế

describe('deleteTodolist Service', () => {
    beforeEach(async () => {
        await redis.flushdb(); // Dọn dẹp Redis trước mỗi bài kiểm tra
    });

    afterAll(async () => {
        if (redis.status === 'ready') {
            await redis.quit(); // Đóng kết nối Redis
        }
    });

    // Test case 1: Xóa task thành công
    it('should delete a task successfully', async () => {
        // Thêm các task vào Redis
        await redis.rpush('todos', 'Task 1', 'Task 2', 'Task 3');

        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('1'), // Xóa Task 2 (index 1)
            },
            json: jest.fn(),
        };

        await deleteTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { message: 'Task deleted successfully' },
            200
        );

        // Kiểm tra danh sách sau khi xóa
        const todos = await redis.lrange('todos', 0, -1);
        expect(todos).toEqual(['Task 1', 'Task 3']); // Task 2 đã bị xóa
    });

    // Test case 2: ID không hợp lệ
    it('should return 400 if ID is invalid', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('abc'), // ID không hợp lệ
            },
            json: jest.fn(),
        };

        await deleteTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Invalid ID' },
            400
        );

        // Đảm bảo không có task nào bị xóa
        const todos = await redis.lrange('todos', 0, -1);
        expect(todos.length).toBe(0);
    });

    // Test case 3: Không có task nào để xóa
    it('should return 404 if no tasks are available', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('0'), // Bất kỳ ID nào
            },
            json: jest.fn(),
        };

        await deleteTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'No tasks found' },
            404
        );
    });

    // Test case 4: ID vượt quá danh sách
    it('should return 404 if ID is out of range', async () => {
        // Thêm một task vào Redis
        await redis.rpush('todos', 'Task 1');

        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('5'), // ID vượt quá phạm vi
            },
            json: jest.fn(),
        };

        await deleteTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Task not found' },
            404
        );

        // Đảm bảo danh sách không thay đổi
        const todos = await redis.lrange('todos', 0, -1);
        expect(todos).toEqual(['Task 1']);
    });

    // Test case 5: Lỗi khi xóa task
    it('should return 500 if an error occurs while deleting a task', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('0'), // Giả định xóa task đầu tiên
            },
            json: jest.fn(),
        };

        redis.disconnect(); // Ngắt kết nối Redis để mô phỏng lỗi

        await deleteTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Failed to delete task(s)' },
            500
        );
    });
});
