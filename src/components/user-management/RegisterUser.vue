<template>
  <h2>Register A New User</h2>
  <el-card class="register-el-card">
    <el-alert
      v-if="message"
      :title="message"
      type="info"
      show-icon
      center
      style="margin-top: 20px;"
    />
    <el-alert
      v-if="isError"
      :title="error?.message"
      :description="error?.response?.data?.message"
      type="error"
      show-icon
      center
      style="margin-top: 20px;"
    />
    <el-form :model="user" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item
        v-for="(field, key) in formFields"
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
          :label-position="field.labelPosition"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
          @keyup.enter="submitForm"
          :disabled="isPending || !isFormValid"
        >
          Register
        </el-button>
        <el-button
          v-if="isResetButtonVisible"
          @click="resetForm"
        >
          Reset
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import { createUser } from '@api/users/createUser.ts'
import type { RegisterFormFields, RegisterFormKeys, User } from '@types'


const router = useRouter()

const user: User = reactive({
  // create Users with default privileges
  role: 'user',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const formRef = ref<FormInstance>()
const message = ref<string | null>(null)

const isFormValid = ref(false)


const { mutate, isPending, isError, error } = useMutation({
  mutationKey: ['createUser'],
  mutationFn: async ({ user }: { user: User }) => {
    await createUser(user)
  },
  onSuccess: () => {
    message.value = 'User created successfully'
    router.push('/login')
  },
  onError: (error) => {
    message.value = `Error: ${error.message}`
  }
})

const isResetButtonVisible = computed(() => !!user)

const formFields: Record<RegisterFormKeys, RegisterFormFields> = {
  username: {
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
    component: 'el-input',
    labelPosition: 'top'
  },
  email: {
    label: 'Email',
    type: 'text',
    placeholder: 'Enter email',
    component: 'el-input'
  },
  firstName: {
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter first name',
    component: 'el-input'
  },
  lastName: {
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter last name',
    component: 'el-input'
  },
  password: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    component: 'el-input',
    showPassword: true
  },
  confirmPassword: {
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm password',
    component: 'el-input',
    showPassword: true
  }
}


const validateConfirmPassword = (rule, value, callback) => {
  if (value !== user.password) {
    callback(new Error('Passwords do not match'))
  } else {
    callback()
  }
}

const validateUsername = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  const minLength = 6
  const maxLength = 20

  if (!value) {
    return callback(new Error('Username is required'))
  }

  if (value.length < minLength || value.length > maxLength) {
    return callback(new Error(`Username must be between ${minLength} and ${maxLength} characters`))
  }

  if (/\s/.test(value)) {
    return callback(new Error('Username cannot contain spaces'))
  }

  if (!/[A-Z]/.test(value)) {
    return callback(new Error('Username must contain at least one uppercase letter'))
  }

  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return callback(new Error('Username can only contain letters, numbers, and underscores'))
  }

  callback()
}


const rules = reactive<FormRules<typeof user>>({
  username: [
    { required: true, message: 'Please input a username', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please input an email', trigger: 'blur' },
    { type: 'email', message: 'Please input a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input a password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

const submitForm = () => {
  if (!formRef.value) {
    console.error('formRef is null')
    return
  }

  formRef.value.validate((valid: boolean) => {
    if (valid) {
      mutate({ user: user })
    } else {
      ElMessage.error('Please correct the form errors.')
    }
  })
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>


<style scoped>
.register-el-card {
  margin: 20px;
  max-width: 480px;
  justify-content: left;
  display: flex;
  flex-direction: column;
}
</style>