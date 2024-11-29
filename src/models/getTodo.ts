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
export const getById = async (id: number) => {
    const todos = await redis.lrange('todos', 0, -1);
    if (id < 0 || id >= todos.length) throw new Error('ID out of range');
    return todos[id];
};