import { Hono } from 'hono';
import { createTodolist } from '../services/create.service';
import { getTodolist } from '../services/get.service';
import { getAllTodolist } from '../services/get-all.service';
import { updateTodolist } from '../services/update.service';
import { deleteTodolist } from '../services/delete.service';

const todoRouter = new Hono();

// Định nghĩa các routes cho todoRouter
todoRouter.post('/todo-list/create', createTodolist); // Tạo TODO
todoRouter.get('/todo-list/get/:id?', getTodolist); // Lấy chi tiết TODO
todoRouter.get('/todo-list/get-all', getAllTodolist); // Lấy tất cả TODOs
todoRouter.put('/todo-list/update/:id?', updateTodolist); // Cập nhật TODO
todoRouter.delete('/todo-list/delete/:id', deleteTodolist); // Xóa TODO

export default todoRouter;
