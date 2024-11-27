// src/routes/todoRoutes.ts
import { Hono } from 'hono';
import { createTodolist } from '../services/create.service';
import { getTodolist } from '../services/get.service';
import { getAllTodolist } from '../services/get-all.service';
import { updateTodolist } from '../services/update.service';
import { deleteTodolist } from '../services/delete.service';

const todoRouter = new Hono();

// Định nghĩa các routes cho todoRouter
todoRouter.post('/todo-list/create', createTodolist);
todoRouter.get('/todo-list/get/:id?', getTodolist);
todoRouter.get('/todo-list/get-all', getAllTodolist);
todoRouter.put('/todo-list/update/:id?', updateTodolist);
todoRouter.delete('/todo-list/delete/:id?', deleteTodolist);

export default todoRouter;
