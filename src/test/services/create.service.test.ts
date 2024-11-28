import { createTodolist } from 'src/services/create.service';
import { redis } from 'src/models/todoModel'; // Kết nối Redis thực tế

describe('createTodolist Service', () => {
    // Dọn dẹp Redis trước mỗi bài kiểm tra
    beforeEach(async () => {
        await redis.flushdb();
    });

    // Đóng kết nối Redis sau khi hoàn tất
    afterAll(async () => {
        if (redis.status === 'ready') {
            await redis.quit();
        }
    });

    // Case 1: Thêm task thành công
    it('should add a task successfully', async () => {
        const c: any = {
            req: {
                json: jest.fn().mockResolvedValue({ task: 'Test task' }),
            },
            json: jest.fn(),
        };

        await createTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { message: 'Task added successfully' },
            201
        );

        // Kiểm tra dữ liệu trong Redis
        const todos = await redis.lrange('todos', 0, -1);
        expect(todos).toContain('Test task');
    });

    // Case 2: Thiếu task
    it('should return 400 if task is missing in the body', async () => {
        const c: any = {
            req: {
                json: jest.fn().mockResolvedValue({}), // Không có task
            },
            json: jest.fn(),
        };

        await createTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Task is required' },
            400
        );

        // Kiểm tra không có thay đổi trong Redis
        const todos = await redis.lrange('todos', 0, -1);
        expect(todos.length).toBe(0);
    });

    // Case 3: Lỗi khi thêm task
    it('should return 500 if an error occurs while adding a task', async () => {
        const c: any = {
            req: {
                json: jest.fn().mockResolvedValue({ task: 'Test task' }),
            },
            json: jest.fn(),
        };

        // Ngắt kết nối Redis để mô phỏng lỗi
        redis.disconnect();

        await createTodolist(c);

        // Kiểm tra phản hồi lỗi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Failed to add task' },
            500
        );
    });
});
