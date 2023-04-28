import fs, { readFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const writeFile = (fileName, data) =>
    fs.writeFile(fileName, JSON.stringify(data), 'utf-8', (err, data) => console.log(data));

readFile('todo.json', 'utf-8', (err, data) => {
    let todos = JSON.parse(data);

    const newTodo = todos.map((todoOb) => ({ ...todoOb, id: uuidv4() }));

    writeFile('newTodo.json', newTodo);
});
