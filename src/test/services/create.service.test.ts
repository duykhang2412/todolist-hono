import { createTodolist } from 'src/services/create.service';
import { redis } from 'src/models/todoModel'; // Kết nối Redis thực tế

describe('createTodolist Service', () => {
    beforeEach(async () => {
        await redis.flushdb(); // Dọn dẹp Redis trước mỗi bài kiểm thử
    });

    afterAll(async () => {
        if (redis.status === 'ready') {
            await redis.quit(); // Kiểm tra kết nối trước khi đóng
        }
    });
    // case 1: thêm task thành công
    it('should add a task successfully', async () => {
        const c: any = {
            req: {
                json: jest.fn().mockResolvedValue({ task: 'Test task' }),
            },
            json: jest.fn(),
        };

        await createTodolist(c);

        expect(c.json).toHaveBeenCalledWith(
            { message: 'Task added successfully' },
            201
        );

        const todos = await redis.lrange('todos', 0, -1);
        expect(todos).toContain('Test task');
    });
    // case 2 : thiếu task 
    it('should return 400 if task is missing in the body', async () => {
        const c: any = {
            req: {
                json: jest.fn().mockResolvedValue({}),
            },
            json: jest.fn(),
        };

        await createTodolist(c);

        expect(c.json).toHaveBeenCalledWith(
            { error: 'Task is required' },
            400
        );

        const todos = await redis.lrange('todos', 0, -1);
        expect(todos.length).toBe(0);
    });
    // case 3 : lỗi khi thêm task 
    it('should return 500 if an error occurs while adding a task', async () => {
        const c: any = {
            req: {
                json: jest.fn().mockResolvedValue({ task: 'Test task' }),
            },
            json: jest.fn(),
        };

        redis.disconnect(); // Ngắt kết nối Redis để mô phỏng lỗi

        await createTodolist(c);

        expect(c.json).toHaveBeenCalledWith(
            { error: 'Failed to add task' },
            500
        );
    });
});

