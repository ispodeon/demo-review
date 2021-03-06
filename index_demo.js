// // ~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~
// const Api = (() => {
// 	const baseUrl = "https://jsonplaceholder.typicode.com";
// 	const path = "todos";

// 	const getTodos = () =>
// 		fetch([baseUrl, path].join("/")).then((response) => response.json());

// 	const deleteTodo = (id) =>
// 		fetch([baseUrl, path, id].join("/"), {
// 			method: "DELETE",
// 		});

// 	return {
// 		getTodos,
// 		deleteTodo,
// 	};
// })();

// // ~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~
// const View = (() => {
// 	const domstr = {
// 		todolist: "#todolist__container",
// 		deletebtn: ".deletebtn",
// 	};

// 	const render = (ele, tmp) => {
// 		ele.innerHTML = tmp;
// 	};
// 	const createTmp = (arr) => {
// 		let tmp = "";
// 		arr.forEach((todo) => {
// 			tmp += `
//                 <li>
//                     <span>${todo.title}</span>
//                     <button class="deletebtn" id="${todo.id}">X</button>
//                 </li>
//             `;
// 		});
// 		return tmp;
// 	};

// 	return {
// 		render,
// 		createTmp,
// 		domstr,
// 	};
// })();
// // ~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~
// const Model = ((api, view) => {
// 	const { getTodos, deleteTodo } = api;

// 	class State {
// 		#todolist = [];

// 		get todolist() {
// 			return this.#todolist;
// 		}
// 		set todolist(newtodolist) {
// 			this.#todolist = [...newtodolist];

// 			const todolistEle = document.querySelector(view.domstr.todolist);
// 			const tmp = view.createTmp(this.todolist);

// 			view.render(todolistEle, tmp);

// 			const deletebtns = document.querySelectorAll(view.domstr.deletebtn);

// 			deletebtns.forEach((btn) => {
// 				btn.addEventListener("click", (event) => {
// 					this.todolist = this.todolist.filter(
// 						(todo) => +todo.id !== +event.target.id
// 					);
// 				});
// 			});
// 		}
// 	}

// 	return {
// 		getTodos,
// 		deleteTodo,
// 		State,
// 	};
// })(Api, View);
// // ~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~
// const Controller = ((model, view) => {
// 	const state = new model.State();

// 	const init = () => {
// 		model.getTodos().then((todolist) => {
// 			state.todolist = todolist;
// 		});
// 	};

// 	return { init };
// })(Model, View);

// Controller.init();

// ~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~
const Api = (() => {
	const baseUrl = "https://jsonplaceholder.typicode.com";
	const path = "todos";

	const getTodos = () =>
		fetch([baseUrl, path].join("/")).then((response) => response.json());

	const deleteTodo = (id) =>
		fetch([baseUrl, path, id].join("/"), {
			method: "DELETE",
		});

	const addTodo = (newtodo) =>
		fetch([baseUrl, path].join("/"), {
			method: "POST",
			body: JSON.stringify(newtodo),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		}).then((response) => response.json());

	return {
		getTodos,
		deleteTodo,
        addTodo
	};
})();

// ~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~
const View = (() => {
	const domstr = {
		todolist: "#todolist__container",
		deletebtn: ".deletebtn",
		inputbox: ".todolist__input",
	};

	const render = (ele, tmp) => {
		ele.innerHTML = tmp;
	};
	const createTmp = (arr) => {
		let tmp = "";
		arr.forEach((todo) => {
			tmp += `
                <li>
                    <span>${todo.id}-${todo.title}</span>
                    <button class="dlt ${todo.id} deletebtn">X</button>
                </li>
            `;
		});
		return tmp;
	};

	return {
		render,
		createTmp,
		domstr,
	};
})();
// ~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
	const { getTodos, deleteTodo, addTodo } = api;

	class Todo {
		constructor(title) {
			this.title = title;
			this.userId = 3;
			this.completed = false;
		}
	}

	class State {
		#todolist = [];

		get todolist() {
			return this.#todolist;
		}
		set todolist(newtodolist) {
			this.#todolist = [...newtodolist];

			const todolistEle = document.querySelector(view.domstr.todolist);
			const tmp = view.createTmp(this.todolist);

			view.render(todolistEle, tmp);
		}
	}

	return {
		getTodos,
		deleteTodo,
        addTodo,
		State,
		Todo,
	};
})(Api, View);
// ~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
	const state = new model.State();

	const addTodo = () => {
		const inputbox = document.querySelector(view.domstr.inputbox);
		inputbox.addEventListener("keyup", (event) => {
			if (event.key === "Enter" && event.target.value.trim() !== '') {
				const newtodo = new model.Todo(event.target.value);

                model.addTodo(newtodo).then(todo => {
                    state.todolist = [todo, ...state.todolist];
                });

                event.target.value = '';
			}
		});
	};

	const deleteTodo = () => {
		const todolistEle = document.querySelector(view.domstr.todolist);
		todolistEle.addEventListener("click", (event) => {
			const [type, id] = event.target.className.split(" ");
			console.log(type, id);

			if (type === "dlt") {
				state.todolist = state.todolist.filter(
					(todo) => +todo.id !== +id
				);
			}
			model.deleteTodo(id);
		});
	};

	const init = () => {
		model.getTodos().then((todolist) => {
			state.todolist = [...todolist.reverse()];
		});
	};

	const bootstrap = () => {
		init();
		deleteTodo();
		addTodo();
	};

	return { bootstrap };
})(Model, View);

Controller.bootstrap();
