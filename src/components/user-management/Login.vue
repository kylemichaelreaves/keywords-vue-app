<template>
  <div>
    <el-form
        :model="user"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        class="login-form"
    >
      <el-form-item label="Username" prop="username">
        <el-input v-model="user.username" placeholder="Enter username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="user.password" placeholder=
        "Enter password" type="password"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitForm">Login</el-button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useAuthStore} from "@stores/auth";

export default defineComponent({
  name: 'Login',
  setup() {
    const user = useAuthStore();

    const rules = {
      username: [
        {required: true, message: 'Please enter username', trigger: 'blur'}
      ],
      password: [
        {required: true, message: 'Please enter password', trigger: 'blur'}
      ]
    };

    return {
      user,
      rules
    };
  }
});

</script>


<style scoped>

</style>