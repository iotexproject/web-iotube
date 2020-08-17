import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";

@remotedev
export class TodoStore {
  @observable todos = [
    { id: 1, text: "Buy eggs", completed: true },
    { id: 2, text: "Write a post", completed: false },
  ];

  @action.bound
  addTodo(text: string) {
    this.todos.push({ id: this.todos.length + 1, text, completed: false });
  }

  @action.bound
  toggleTodo(index: number) {
    this.todos[index].completed = !this.todos[index].completed;
  }
  @computed
  get remainingTodos(): number {
    return this.todos.filter((t) => !t.completed).length;
  }
}
