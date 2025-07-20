<!-- components/transactions/MemoAvatar.vue -->
<template>
  <div class="memo-avatar-container" :data-testid="dataTestId">
    <div class="avatar-display">
      <el-avatar
        :size="64"
        shape="square"
        :src="model"
        class="memo-avatar"
        :data-testid="`${dataTestId}-display`"
      >
        {{ avatarFallbackText }}
      </el-avatar>

      <div class="avatar-info" v-if="model">
        <el-text size="small" type="success">
          <el-icon>
            <Check />
          </el-icon>
          Logo uploaded
        </el-text>
      </div>
    </div>

    <div class="avatar-actions">
      <el-upload
        :show-file-list="false"
        :before-upload="handleFileSelect"
        accept="image/*"
        :disabled="isUploading"
        :data-testid="`${dataTestId}-upload`"
      >
        <el-button
          type="primary"
          size="small"
          :loading="isUploading"
          icon="Upload"
          :data-testid="`${dataTestId}-upload-button`"
        >
          {{ model ? 'Change Logo' : 'Upload Logo' }}
        </el-button>
      </el-upload>

      <el-button
        v-if="model && !isUploading"
        type="danger"
        size="small"
        @click="removeAvatar"
        :data-testid="`${dataTestId}-remove-button`"
      >
        Remove
      </el-button>
    </div>

    <div class="upload-progress" v-if="isUploading">
      <el-progress :percentage="uploadProgress" :show-text="false" />
      <el-text size="small">Uploading...</el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { UploadRawFile } from 'element-plus'
import { ElAvatar, ElButton, ElIcon, ElMessage, ElProgress, ElText, ElUpload } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { httpClient } from '@api/httpClient.ts'

interface Props {
  placeholder?: string;
  disabled?: boolean;
  dataTestId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestId: 'memo-avatar'
})


const model = defineModel<string | undefined>()


const memoName = inject<string>('memoName', '')

const isUploading = ref(false)
const uploadProgress = ref(0)

const avatarFallbackText = computed(() => {
  if (!memoName) return '??'
  return memoName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
})

const handleFileSelect = async (file: UploadRawFile) => {
  if (props.disabled) return false

  // Validate file size (2MB limit)
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('Logo file size must be less than 2MB')
    return false
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    ElMessage.error('Please select an image file')
    return false
  }

  try {
    await uploadFile(file)
    return true // Allow the upload to proceed
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    ElMessage.error(`Logo upload failed: ${errorMessage}`)
    return false // Prevent the upload
  }
}

const uploadFile = async (file: File) => {
  isUploading.value = true
  uploadProgress.value = 0

  try {
    // Convert the file to base64
    const fileBase64 = await convertFileToBase64(file)
    const base64Data = fileBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    const response = await httpClient.patch(`/memos/${encodeURIComponent(memoName)}`, {
      file_data: base64Data,
      file_name: file.name,
      file_type: file.type
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (!response.data) {
      ElMessage.error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.data

    if (result.success && result.avatarUrl) {
      model.value = result.avatarUrl
      ElMessage.success('Logo uploaded successfully')
    } else {
      ElMessage.error(result.error || 'Upload failed')
    }

  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    ElMessage.error(`Failed to upload logo: ${errorMessage}`)
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const removeAvatar = () => {
  if (props.disabled) return
  model.value = undefined
  ElMessage.success('Logo removed')
}
</script>

<style scoped>
.memo-avatar-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avatar-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.memo-avatar {
  border: 2px solid var(--el-border-color);
  background: #f5f5f5;
}

.avatar-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.avatar-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>