import { getAllTodolist } from 'src/services/get-all.service';
import { redis } from 'src/models/todoModel';

describe('getAllTodolist Service', () => {
    beforeEach(async () => {
        await redis.flushdb(); // Dọn dẹp Redis trước mỗi bài kiểm thử
    });

    afterAll(async () => {
        if (redis.status === 'ready') {
            await redis.quit(); // Kiểm tra kết nối trước khi đóng
        }
    });

    // Case 1: Lấy danh sách todos thành công
    it('should fetch all todos successfully', async () => {
        // Thêm dữ liệu mẫu vào Redis
        await redis.rpush('todos', 'Task 1', 'Task 2', 'Task 3');

        const c: any = {
            json: jest.fn(), // Giả lập phương thức `json` của context
        };

        await getAllTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith(
            { todos: ['Task 1', 'Task 2', 'Task 3'] }
        );
    });

    // Case 2: Danh sách todos rỗng
    it('should return an empty array if no todos exist', async () => {
        const c: any = {
            json: jest.fn(),
        };

        await getAllTodolist(c);

        // Kiểm tra phản hồi
        expect(c.json).toHaveBeenCalledWith({ todos: [] });
    });

    // Case 3: Lỗi khi kết nối Redis
    it('should return 500 if an error occurs while fetching todos', async () => {
        const c: any = {
            json: jest.fn(),
        };

        redis.disconnect();
        await getAllTodolist(c);

        // Kiểm tra phản hồi lỗi
        expect(c.json).toHaveBeenCalledWith(
            { error: 'Unable to fetch todos' },
            500
        );
    });
});
