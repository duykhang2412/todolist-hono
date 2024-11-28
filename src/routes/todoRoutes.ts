import { Hono } from 'hono';
import { createTodolist, getTodolist, getAllTodolist, updateTodolist, deleteTodolist } from '../controllers/todoController';

const todoRouter = new Hono();

todoRouter.post('/create', createTodolist);
todoRouter.get('/get/:id?', getTodolist);
todoRouter.get('/get-all', getAllTodolist);
todoRouter.put('/update/:id', updateTodolist);
todoRouter.delete('/delete/:id', deleteTodolist);

export default todoRouter;
