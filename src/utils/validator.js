import validator from 'validator';

export const validateTodo = ({ task, status }) => {
    console.log(task, status);
    if (!task || validator.isEmpty(task + '')) return 'task is required';
    if (typeof task !== 'string') return 'task must be a string';

    if (!validator.isBoolean(status + '')) return 'invalid status value';
    return false;
};
