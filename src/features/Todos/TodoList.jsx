import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import {selectVisibleTodos, loadToggleTodo, deleteTodo, todosSelectors} from './todos-slice';
import { loadTodo } from "./todos-slice";


export const TodoList = () => {
	const activeFilter = useSelector(state => state.filter)
	// const todos = useSelector(state => selectVisibleTodos(state, activeFilter));
	const todos = useSelector(todosSelectors.selectAll);
	const visibleTodos = selectVisibleTodos(todos, activeFilter);
	const dispatch = useDispatch();
	const {loading, error} = useSelector(state => state.todos);

	useEffect(() => {
		dispatch(loadTodo())
			.unwrap()
			.then(() => {
				toast('All todos were fetch');
			})
			.catch((err) => {
				toast(err)
			});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	return (
		<>
		<ToastContainer/>
			<ul>
				{error && <h5>{error}</h5>}
				{loading === 'loading' && <h5>Loading...</h5>}
				{loading === 'idle' && !error && visibleTodos.map((todo) => (
					<li key={todo.id}>
						<input
							type="checkbox"
							checked={todo.completed}
							onChange={() => dispatch(loadToggleTodo(todo.id))}
						/>{" "}
						{todo.title}{" "}
						<button onClick={() => dispatch(deleteTodo(todo.id))}>delete</button>
					</li>
				))}
			</ul>
		</>  
	);
};
