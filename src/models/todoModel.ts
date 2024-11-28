import Redis from 'ioredis';

export const redis = new Redis();

export const getTodos = async () => {
    try {
        return await redis.lrange('todos', 0, -1);
    } catch (error) {
        console.error('Error fetching todos from Redis:', error);
        throw new Error('Failed to fetch todos from Redis');
    }
};

export const addTodo = async (task: string) => {
    return redis.rpush('todos', task);
};

export const getById = async (id: number) => {
    const todos = await redis.lrange('todos', 0, -1);
    if (id < 0 || id >= todos.length) throw new Error('ID out of range');
    return todos[id];
};

export const updateTodo = async (index: number, task: string) => {
    const todos = await redis.lrange('todos', 0, -1);
    if (index < 0 || index >= todos.length) throw new Error('Index out of range');
    await redis.lset('todos', index, task);
};

export const deleteTodo = async (index: number) => {
    const todos = await redis.lrange('todos', 0, -1);
    const taskToRemove = await redis.lindex('todos', index);
    if (taskToRemove) {
        await redis.lrem('todos', 1, taskToRemove);
    }
};
