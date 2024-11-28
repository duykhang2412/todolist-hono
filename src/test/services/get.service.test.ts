import { getTodolist } from 'src/services/get.service';
import { redis } from 'src/models/todoModel';

describe('getTodolist Service', () => {
    beforeEach(async () => {
        await redis.flushdb(); // Dọn dẹp Redis trước mỗi bài kiểm thử
    });

    afterAll(async () => {
        if (redis.status === 'ready') {
            await redis.quit(); // Kiểm tra kết nối trước khi đóng
        }
    });

    // Case 1: Lấy TODO thành công
    it('should fetch a todo by ID successfully', async () => {
        // Thêm dữ liệu mẫu vào Redis
        await redis.rpush('todos', 'Task 1', 'Task 2', 'Task 3');

        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('1'), // Lấy Task 2 (index 1)
            },
            json: jest.fn(),
        };

        await getTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith({ todo: 'Task 2' });
    });

    // Case 2: ID không hợp lệ
    it('should return 400 if ID is invalid', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('abc'), // ID không hợp lệ
            },
            json: jest.fn(),
        };

        await getTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith({ error: 'Invalid ID' }, 400);
    });

    // Case 3: ID không tồn tại trong danh sách
    it('should return 500 if ID is out of range', async () => {
        // Thêm dữ liệu mẫu
        await redis.rpush('todos', 'Task 1');

        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('5'), // ID vượt quá phạm vi
            },
            json: jest.fn(),
        };

        await getTodolist(c);

        // Kiểm tra phản hồi lỗi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Unable to fetch todo by ID' },
            500
        );
    });

    // Case 4: Lỗi khi kết nối Redis
    it('should return 500 if an error occurs while fetching a todo', async () => {
        const c: any = {
            req: {
                param: jest.fn().mockReturnValue('0'), // Giả định lấy Task 0
            },
            json: jest.fn(),
        };

        redis.disconnect(); // Ngắt kết nối Redis để mô phỏng lỗi

        await getTodolist(c);

        // Kiểm tra phản hồi lỗi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Unable to fetch todo by ID' },
            500
        );
    });
});
