import Redis from 'ioredis';

export const redis = new Redis();

export const updateTodo = async (index: number, task: string) => {
    const todos = await redis.lrange('todos', 0, -1);
    if (index < 0 || index >= todos.length) throw new Error('Index out of range');
    await redis.lset('todos', index, task);
};