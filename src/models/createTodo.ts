import Redis from 'ioredis';

export const redis = new Redis();

export const addTodo = async (task: string) => {
    return redis.rpush('todos', task);
};
