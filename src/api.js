const BASE_URL = 'http://localhost:3001/todos';

export const createTodo = async (title) => {
    const res = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title, completed: false})
    })
    const data = await res.json();
    return data;
};

export const loadTodo = async () => {
    const res = await fetch('http://localhost:3001/todos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await res.json();
    return data;	
};

export const deleteTodo = async (id) => {
    const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    await res.json();
    return id;
};

export const loadToggleTodo = async (id, field) => {
    const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',			
        },
        body: JSON.stringify(field)
    })
    const data = await res.json();
    return data;
};