import Redis from 'ioredis';

export const redis = new Redis();


export const deleteTodo = async (index: number) => {
    const todos = await redis.lrange('todos', 0, -1);
    const taskToRemove = await redis.lindex('todos', index);
    if (taskToRemove) {
        await redis.lrem('todos', 1, taskToRemove);
    }
};