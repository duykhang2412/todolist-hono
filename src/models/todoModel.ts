import Redis from 'ioredis';

const redis = new Redis();

export const getTodos = async () => {
    try {
        const todos = await redis.lrange('todos', 0, -1); // Lấy danh sách todos
        return todos;
    } catch (error) {
        console.error('Error fetching todos from Redis:', error);
        throw new Error('Failed to fetch todos from Redis');
    }
};
export const addTodo = async (task: string) => {
    return await redis.rpush('todos', task);  // Thêm todo vào cuối danh sách
};
// Lấy TODO theo ID
export const getById = async (id: number) => {
    const todos = await redis.lrange('todos', 0, -1);  // Lấy danh sách todos
    if (id < 0 || id >= todos.length) throw new Error('ID out of range');  // Kiểm tra ID hợp lệ
    return todos[id];  // Trả về TODO item tại vị trí ID
};
export const updateTodo = async (index: number, task: string) => {
    const todos = await redis.lrange('todos', 0, -1);  // Lấy danh sách todos
    if (index < 0 || index >= todos.length) throw new Error('Index out of range');  // Kiểm tra chỉ mục hợp lệ
    await redis.lset('todos', index, task);  // Cập nhật task tại chỉ mục
};

export const deleteTodo = async (index: number) => {
    try {
        const todos = await redis.lrange('todos', 0, -1); // Lấy danh sách todos
        if (!todos || index < 0 || index >= todos.length) {
            throw new Error('Index out of range');
        }
        const taskToRemove = await redis.lindex('todos', index); // Lấy task cần xóa
        if (taskToRemove) {
            await redis.lrem('todos', 1, taskToRemove); // Xóa task
        }
    } catch (error) {
        console.error('Error deleting task in Redis:', error);
        throw new Error('Failed to delete task in Redis');
    }
};
