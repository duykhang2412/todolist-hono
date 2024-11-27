import { Hono } from 'hono';
import todoRouter from './routes/todoRoutes'; // Import đúng router
import { serve } from '@hono/node-server'; // Dùng để chạy ứng dụng trên Node.js
import Redis from 'ioredis'; // Nếu sử dụng Redis

// Khởi tạo ứng dụng Hono
const app = new Hono();

// Cấu hình kết nối Redis
const redis = new Redis({
    host: 'localhost', // Hoặc URL Redis của bạn
    port: 6379,        // Cổng mặc định của Redis
});

// Gắn router TODO vào ứng dụng
app.route('/todo', todoRouter); // Đồng bộ với các route đã định nghĩa

// Trang chủ
app.get('/', (c) => c.text('TODO App with Hono & Redis'));

// Endpoint kiểm tra kết nối Redis
app.get('/check-redis', async (c) => {
    try {
        const pong = await redis.ping();
        return c.text(`Redis connection status: ${pong}`);
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        return c.text('Error connecting to Redis', 500);
    }
});

// Export app để có thể sử dụng trong test
export { app };

// Chạy server với Node.js
serve(app, (info) => {
    console.log(`Server is running at http://localhost:${info.port}`);
});
