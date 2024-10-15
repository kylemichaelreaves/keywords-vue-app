<template>
  <el-form :model="user" :rules="rules" ref="formRef" label-width="100px">
    <el-form-item
        v-for="(field, key) in formFields"
        :key="key"
        :label="field.label"
        :prop="key"
    >
      <el-input
          v-model="user[key as keyof User]"
          :type="field.type"
          :placeholder="field.placeholder"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">Register</el-button>
      <el-button
          v-if="formRef"
          @click="resetForm"
      >
        Reset
      </el-button>
    </el-form-item>
    <el-alert
        v-if="message"
        :title="message"
        type="info"
        show-icon
        center
        style="margin-top: 20px;"
    />
  </el-form>
</template>

<script lang="ts" setup>
import {ref, reactive} from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';
import type { User } from '@types';



const user = reactive<User>({
  role: "",
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const formRef = ref<FormInstance>();
const message = ref<string | null>(null);

const formFields = {
  username: {label: "Username", type: "text", placeholder: "Enter username"},
  email: {label: "Email", type: "text", placeholder: "Enter email"},
  password: {label: "Password", type: "password", placeholder: "Enter password"},
  confirmPassword: {label: "Confirm Password", type: "password", placeholder: "Confirm password"}
};


const validateConfirmPassword = (rule: any, value: string, callback: Function) => {
  if (value !== user.password) {
    callback(new Error('Passwords do not match'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<typeof user>>({
  username: [
    {required: true, message: 'Please input a username', trigger: 'blur'},
    {min: 3, message: 'Username must be at least 3 characters', trigger: 'blur'}
  ],
  email: [
    {required: true, message: 'Please input an email', trigger: 'blur'},
    {type: 'email', message: 'Please input a valid email', trigger: 'blur'}
  ],
  password: [
    {required: true, message: 'Please input a password', trigger: 'blur'},
    {min: 6, message: 'Password must be at least 6 characters', trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, message: 'Please confirm your password', trigger: 'blur'},
    {validator: validateConfirmPassword, trigger: 'blur'}
  ]
});

const submitForm = () => {
  if (formRef.value) {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        // Simulate API call
        message.value = `User ${user.username} registered successfully!`;
        resetForm();
      } else {
        ElMessage.error('Please correct the form errors.');
      }
    });
  }
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};
</script>


<style scoped>
</style>