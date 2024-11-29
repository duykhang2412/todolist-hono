import { Hono } from 'hono';
import { createTodolist } from '../controllers/createController';
import { updateTodolist } from '../controllers/updateController';
import { deleteTodolist } from '../controllers/deleteController';
import { getTodolist, getAllTodolist } from '../controllers/getController';
const todoRouter = new Hono();

todoRouter.post('/create', createTodolist);
todoRouter.get('/get/:id?', getTodolist);
todoRouter.get('/get-all', getAllTodolist);
todoRouter.put('/update/:id', updateTodolist);
todoRouter.delete('/delete/:id', deleteTodolist);

export default todoRouter;
