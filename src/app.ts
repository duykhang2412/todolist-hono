import { Hono } from 'hono';
import { todoRouter } from './controllers/todoController';
import { serve } from '@hono/node-server'; // Dùng để chạy ứng dụng trên Node.js
import Redis from 'ioredis';  // Nếu sử dụng Redis

// Khởi tạo ứng dụng Hono
const app = new Hono();

// Cấu hình kết nối Redis (nếu cần)
const redis = new Redis({
    host: 'localhost', // Hoặc URL Redis của bạn
    port: 6379,        // Cổng mặc định của Redis
});

// Gắn router TODO vào ứng dụng
app.route('/todo', todoRouter);

// Trang chủ
app.get('/', (c) => c.text('TODO App with Hono & Redis'));


app.get('/check-redis', async (c) => {
    try {
        const pong = await redis.ping();
        return c.text(`Redis connection status: ${pong}`);
    } catch (error) {
        return c.text('Error connecting to Redis', 500);
    }
});

// Export app để có thể sử dụng trong test
export { app };

// Chạy server với Node.js (không cần trong test)
serve(app, (info) => {
    console.log(`Server is running at http://localhost:${info.port}`);
});
