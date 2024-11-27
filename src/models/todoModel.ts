import Redis from 'ioredis';

const redis = new Redis();

export const getTodos = async () => {
    return await redis.lrange('todos', 0, -1);  // Lấy tất cả todos
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
    const todos = await redis.lrange('todos', 0, -1);  // Lấy danh sách todos
    if (index < 0 || index >= todos.length) throw new Error('Index out of range');  // Kiểm tra chỉ mục hợp lệ
    const taskToRemove = await redis.lindex('todos', index);  // Lấy task tại chỉ mục
    if (taskToRemove) await redis.lrem('todos', 1, taskToRemove);  // Xóa task
};
