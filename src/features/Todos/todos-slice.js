import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';

import {resetToDefault} from '../Reset/reset-action';

const todosAdapter =createEntityAdapter({
	selectId: (todo) => todo.id,
})

export const createTodo = createAsyncThunk(
	'@@todos/create-todo',
	async (title, {extra: api}) => {
		return api.createTodo(title)
	}
);

export const loadTodo = createAsyncThunk(
	'@@todos/load-todo',
	async (_, {
		rejectWithValue, extra: api
	}) => {
		try {
			return api.loadTodo()
		} catch(err) {
			return rejectWithValue('Failed to fetch all todos.')
		}
	},
	{
		condition: (_, {getState, extra}) => {
			const {loading} = getState().todos;

			if (loading === 'loading') {
				return false
			}
		}
	}
);

export const deleteTodo = createAsyncThunk(
	'@@todos/delete-todo',
	async (id, {extra: api}) => {
		return api.deleteTodo(id);
	}
);

export const loadToggleTodo = createAsyncThunk(
	'@@todos/toggle-todo',
	async (id, {getState, extra: api}) => {

		const todo = getState().todos.entities[id]
		return api.loadToggleTodo(id, {completed: !todo.completed})
	}
);



const todoSlice = createSlice({
	name: '@@todos',
	initialState: todosAdapter.getInitialState({
		loading: 'idle',
		error: null
	}),
	// initialState: {
	// 	entities: [],
	// 	loading: 'idle', //loading
	// 	error: null
	// },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(resetToDefault, () => {
				return []
			})
			.addCase(createTodo.fulfilled, (state, action) => {
				todosAdapter.addOne(state, action.payload)
				// state.entities.push(action.payload)
			})
			.addCase(loadTodo.fulfilled, (state, action) => {
				todosAdapter.addMany(state, action.payload)
				// state.entities = action.payload;
			})
			.addCase(deleteTodo.fulfilled, (state, action) => {
				// const id = action.payload;
				// state.entities = state.entities.filter((todo) => todo.id !== id);
				todosAdapter.removeOne(state, action.payload);
			})
			.addCase(loadToggleTodo.fulfilled, (state, action) => {
				const updatedTodo = action.payload;

				// const index = state.entities.findIndex(todo => todo.id === updatedTodo.id);
				// state.entities[index] = updatedTodo;
				todosAdapter.updateOne(state, {
					id: updatedTodo.id,
					changes: {
						completed: updatedTodo.completed
					}

				})

			})
			.addCase(loadTodo, (state) => {
				state.loading = 'loading';
				state.error = null;
			})
			.addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
				state.loading = 'idle';
				state.error = action.payload || action.error.message;
			})
			.addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
				state.loading = 'idle';
			})
	}
});

export const {addTodo, removeTodo, toggleTodo} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;

export const todosSelectors = todosAdapter.getSelectors(state => state.todos)

export const selectVisibleTodos = (todos = [], filter) => {
	switch (filter) {
		case 'all': {
			return todos;
		}
		case 'active': {
			return todos.filter(todo => !todo.completed);
		}
		case 'completed': {
			return todos.filter(todo => todo.completed);
		}
		default: {
			return todos;
		}
	}
}