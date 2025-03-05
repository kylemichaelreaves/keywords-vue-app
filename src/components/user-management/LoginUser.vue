<template>
  <el-alert
    v-if="isError"
    :title="error?.message"
    :description="errorDescription"
    type="error"
    show-icon
    center
    style="margin-top: 20px;"
    size="large"
  />
  <div class="container">
    <el-card class="login-el-card">
      <el-form
        :model="user"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          v-for="(field, key) in loginFormFields"
          :key="key"
          :label="field.label"
          :prop="key"
        >
          <component
            :is="field.component"
            v-model="user[key]"
            :placeholder="field.placeholder"
            :type="field.type"
            :show-password="field.showPassword"
            @keyup.enter="submitForm"
          />
        </el-form-item>

      </el-form>
      <div class="button-container">
        <el-button type="primary" @click="submitForm" :disabled="isDisabledCondition">Login</el-button>
        <!-- TODO Add a link to reset password    -->
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import AuthService from '../../services/auth.service.ts'
import type { LoginFormFields, loginFormKeys } from '@types'
import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '@stores/auth.ts'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const user = ref({
  username: '',
  password: ''
})

const authStore = useAuthStore()
const router = useRouter()

// the button should be disabled when isPending OR if both fields don't have values
const isDisabledCondition = computed(() => {
  return isPending.value || !user.value.username || !user.value.password
})

const errorDescription = computed(() => {
  return isError.value ? error?.response?.data?.message || 'An error occurred' : ''
})

const { mutate, isPending, isError, error } = useMutation({
  mutationKey: ['login'],
  mutationFn: async ({ username, password }: { username: string, password: string }) => {
    return await AuthService.login(username, password)
  },
  onSuccess: (data) => {
    ElMessage.success('Login successful! Wilkommen! Bienvenue! Welcome!')
    const user = data.user
    const token = data.token
    authStore.setUser(user)
    authStore.setToken(token)
    authStore.setIsUserAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/budget-visualizer/transactions')
  },
  onError: (error) => {
    ElMessage.error('Login failed! Please try again!')
    console.error('Login failed', error)
  }
})


const submitForm = () => {
  mutate({ username: user.value.username, password: user.value.password })
}


const loginFormFields: Record<loginFormKeys, LoginFormFields> = {
  username: {
    component: 'el-input',
    label: 'Username',
    placeholder: 'Enter username',
    type: 'text'
  },
  password: {
    component: 'el-input',
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    showPassword: true
  }
}


const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' }
  ]
}

onMounted(() => {
  // check if the user is in local storage
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user') || '')
    authStore.setUser(user)
    authStore.setToken(localStorage.getItem('token') || '')
    authStore.setIsUserAuthenticated(true)
  }

  // check if the user is already in the store
  if (authStore.user && authStore.isUserAuthenticated) {
    router.push('/budget-visualizer/transactions')
  }

})


</script>


<style scoped>
.login-el-card {
  margin: 20px;
  max-width: 480px;
  justify-content: left;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0 0 5px #409EFF);
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.button-container {
  background-color: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>