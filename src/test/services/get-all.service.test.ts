import { getAllTodolist } from '../../services/get-all.service';
import Redis from 'ioredis';

const redis = new Redis();

describe('getAllTodolist Service (using Redis)', () => {
    beforeEach(async () => {
        await redis.del('todos'); // Xóa danh sách trước đó
        await redis.rpush('todos', 'Task 1', 'Task 2', 'Task 3'); // Thêm dữ liệu mẫu
    });

    afterEach(async () => {
        if (redis.status === 'ready') {
            await redis.del('todos'); // Dọn dẹp nếu Redis còn hoạt động
        }
    });

    afterAll(async () => {
        if (redis.status === 'ready') {
            await redis.quit(); // Đóng kết nối Redis
        }
    });

    it('should fetch all todos successfully', async () => {
        const c = mockContext({ page: '1', limit: '3' });

        await getAllTodolist(c);

        expect(c.json).toHaveBeenCalledWith({
            todos: ['Task 1', 'Task 2', 'Task 3'],
            totalItems: 3,
            totalPages: 1,
            currentPage: 1,
        });
    });

    it('should return an empty array if no todos exist', async () => {
        await redis.del('todos'); // Đảm bảo không có dữ liệu
        const c = mockContext({ page: '1', limit: '3' });

        await getAllTodolist(c);

        expect(c.json).toHaveBeenCalledWith({
            todos: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
        });
    });


});

const mockContext = (query: Record<string, string> = {}) => {
    return {
        req: {
            query: jest.fn().mockImplementation((key: string) => query[key]),
        },
        json: jest.fn(),
    } as any;
};
