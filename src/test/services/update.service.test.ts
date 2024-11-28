import { updateTodolist } from 'src/services/update.service';
import { redis } from 'src/models/todoModel';

describe('updateTodolist Service', () => {
    beforeEach(async () => {
        await redis.flushdb(); // Dọn dẹp Redis trước mỗi bài kiểm thử
    });

    afterAll(async () => {
        if (redis.status === 'ready') {
            await redis.quit(); // Kiểm tra kết nối trước khi đóng
        }
    });

    // Case 1: Cập nhật task thành công
    it('should update a task successfully', async () => {
        // Thêm dữ liệu mẫu vào Redis
        await redis.rpush('todos', 'Task 1', 'Task 2', 'Task 3');

        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('1'), // Cập nhật Task 2
                json: jest.fn().mockResolvedValue({ task: 'Updated Task 2' }),
            },
            json: jest.fn(),
        };

        await updateTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { message: 'Task updated successfully' },
            200
        );

        // Kiểm tra dữ liệu trong Redis
        const todos = await redis.lrange('todos', 0, -1);
        expect(todos).toEqual(['Task 1', 'Updated Task 2', 'Task 3']);
    });

    // Case 2: ID không hợp lệ
    it('should return 400 if ID is invalid', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('abc'), // ID không hợp lệ
                json: jest.fn().mockResolvedValue({ task: 'New Task' }),
            },
            json: jest.fn(),
        };

        await updateTodolist(c);

        // Kiểm tra phản hồi lỗi
        expect(c.json).toHaveBeenCalledWith({ error: 'Invalid ID' }, 400);
    });

    // Case 3: Thiếu ID trong URL
    it('should return 400 if ID is missing in the URL', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue(undefined), // Không có ID
                json: jest.fn().mockResolvedValue({ task: 'New Task' }),
            },
            json: jest.fn(),
        };

        await updateTodolist(c);

        // Kiểm tra phản hồi lỗi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'ID is required in the URL' },
            400
        );
    });

    // Case 4: Thiếu task trong body
    it('should return 400 if task is missing in the body', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('0'), // ID hợp lệ
                json: jest.fn().mockResolvedValue({}), // Không có task
            },
            json: jest.fn(),
        };

        await updateTodolist(c);

        // Kiểm tra phản hồi lỗi
        expect(c.json).toHaveBeenCalledWith({ error: 'Task is required' }, 400);
    });

    // Case 5: Lỗi khi kết nối Redis
    it('should return 500 if an error occurs while updating the task', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('0'), // ID hợp lệ
                json: jest.fn().mockResolvedValue({ task: 'Task Updated' }),
            },
            json: jest.fn(),
        };

        redis.disconnect(); // Ngắt kết nối Redis để mô phỏng lỗi

        await updateTodolist(c);

        // Kiểm tra phản hồi lỗi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Connection is closed.' },
            500
        );
    });
});