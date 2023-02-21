<template>
  <div>
    <ul>
      <li v-for="(toDo, index) in toDos" :key="index">
        <span :style="{ textDecoration: toDo.done ? 'line-through' : 'none' }">{{ toDo.text }}</span>
        <el-switch v-model="toDo.done" :model-value="toDo.done" @change="updateToDo(index)" class="todo-switch"/>
      </li>
    </ul>
    <!--    <el-input v-model="newToDo" @keyup.enter="addToDo"/>-->
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, reactive} from "vue";

const ToDoList = defineComponent({
  name: "ToDoList",
  props: {
    initialTodos: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const newToDo = ref("");
    const toDos = reactive(props.initialTodos as { text: string, done: boolean }[]);

    function addToDo() {
      toDos.push({text: newToDo.value, done: false});
      newToDo.value = "";
    }

    function updateToDo(index: number) {
      const newDone = !!toDos[index].done;
      toDos[index] = {...toDos[index], done: newDone};
    }

    return {newToDo, toDos, addToDo, updateToDo};
  }
});
export default ToDoList;
</script>

<style scoped>
li {
  font-size: 11pt;
  margin-bottom: 0.1em;
}
ul {
  padding-left: 40px;
}

.todo-switch {
  margin-left: 10px;
}
</style>
