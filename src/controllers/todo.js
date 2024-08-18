import catchAsync from '../utils/catch-async.js';
import * as todoService from '../services/todo.js';
import { validateTodo } from '../utils/validator.js';
import { ValidationError } from '../utils/error.js';

export const getAllTodos = catchAsync(async (req, res, next) => {
    const { task, status, sort } = req.query;

    let todos = await todoService.getAllTodos();

    if (task || status) {
        todos = todos.filter(
            (todo) =>
                (!task || todo.task.toLowerCase().includes(task.toLowerCase())) &&
                (!status ||
                    (['true', '1'].includes(status) && todo.status) ||
                    (['false', '0'].includes(status) && !todo.status))
        );
    }

    if (sort === 'task') {
        todos.sort((a, b) => (a.task.toLowerCase() > b.task.toLowerCase() ? 1 : -1));
    } else if (sort === '-task') {
        todos.sort((a, b) => (a.task.toLowerCase() < b.task.toLowerCase() ? 1 : -1));
    }

    const total = todos.length;

    if (req.query.page || req.query.limit) {
        const page = req.query.page || 1;
        const limit = req.query.limit || 100;
        todos = todos.slice((page - 1) * limit, page * limit);
    }

    res.status(200).json({ total, todos });
});

export const getTodoById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const todo = await todoService.getTodoById(id);
    res.status(200).json({ todo });
});

export const createTodo = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const { task, status, date } = req.body;

    const error = validateTodo({ task, status });
    if (error) throw new ValidationError(error);

    const todo = await todoService.createTodo({
        task: task.trim(),
        status: !!status,
        date: date,
    });

    res.status(201).json({ todo });
});

export const updateTodo = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { task, status, date } = req.body;

    const error = validateTodo({ task, status });
    if (error) throw new ValidationError(error);

    const todo = await todoService.updateTodo(
        {
            task: task.trim(),
            status: !!status,
            date: date,
        },
        id
    );

    res.status(200).json({ todo });
});

export const removeTodo = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await todoService.removeTodo(id);
    res.status(204).json();
});
