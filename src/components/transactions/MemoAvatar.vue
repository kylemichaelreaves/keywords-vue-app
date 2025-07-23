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
        :http-request="handleCustomUpload"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        :disabled="isUploading || props.disabled"
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

      <!-- Cancel button during upload -->
      <el-button
        v-if="isUploading && abortController"
        size="small"
        @click="cancelUpload"
        :data-testid="`${dataTestId}-cancel-button`"
      >
        Cancel
      </el-button>
    </div>

    <div class="upload-progress" v-if="isUploading">
      <el-progress :percentage="uploadProgress" />
      <el-text size="small">{{ uploadStatusText }}</el-text>
    </div>

    <!-- Error retry option -->
    <div v-if="uploadError" class="upload-error">
      <el-text type="danger" size="small">{{ uploadError }}</el-text>
      <el-button size="small" type="primary" @click="retryUpload">
        Retry
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onUnmounted, ref } from 'vue'
import type { UploadRequestOptions } from 'element-plus'
import { ElAvatar, ElButton, ElIcon, ElMessage, ElProgress, ElText, ElUpload } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { httpClient } from '@api/httpClient.ts'

interface Props {
  placeholder?: string;
  disabled?: boolean;
  dataTestId?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  dataTestId: 'memo-avatar',
  maxSizeMB: 5, // 5MB default
  allowedTypes: () => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
})

const model = defineModel<string | undefined>()
const memoName = inject<string>('memoName', '')

// Upload state
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadStatusText = ref('')
const uploadError = ref('')
const abortController = ref<AbortController | null>(null)
const pendingFile = ref<File | null>(null)

const avatarFallbackText = computed(() => {
  if (!memoName) return '??'
  return memoName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
})

// Cleanup on unmount
onUnmounted(() => {
  if (abortController.value) {
    abortController.value.abort()
  }
})

const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  const maxSize = props.maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: `File size must be less than ${props.maxSizeMB}MB` }
  }

  // Check file type
  if (!props.allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type. Please use JPEG, PNG, WebP, or SVG.' }
  }

  // Additional client-side checks
  if (file.size < 100) {
    return { valid: false, error: 'File appears to be corrupted or empty' }
  }

  return { valid: true }
}

const matchesSignature = (bytes: Uint8Array, signature: number[]): boolean => {
  return signature.every((byte, index) => bytes[index] === byte)
}

const isValidImageSignature = (bytes: Uint8Array): boolean => {
  const signatures = [
    [0xFF, 0xD8, 0xFF], // JPEG
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
    [0x52, 0x49, 0x46, 0x46], // WebP (RIFF)
    [0x3C] // SVG (XML start)
  ]

  return signatures.some(signature => matchesSignature(bytes, signature))
}

const readFileBytesAsync = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      resolve(new Uint8Array(arrayBuffer, 0, 8))
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file.slice(0, 8))
  })
}

const validateFileContent = async (file: File): Promise<boolean> => {
  try {
    const bytes = await readFileBytesAsync(file)
    return isValidImageSignature(bytes)
  } catch {
    return false
  }
}

const handleCustomUpload = async (options: UploadRequestOptions) => {
  const file = options.file as File

  // Reset error state
  uploadError.value = ''

  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    ElMessage.error(validation.error!)
    return
  }

  // Store file for retry capability
  pendingFile.value = file

  // Validate file content
  const isValidContent = await validateFileContent(file)
  if (!isValidContent) {
    ElMessage.error('File does not appear to be a valid image')
    return
  }

  await performUpload(file)
}

const performUpload = async (file: File) => {
  isUploading.value = true
  uploadProgress.value = 0
  uploadStatusText.value = 'Preparing upload...'

  // Create abort controller for cancellation
  abortController.value = new AbortController()

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('memoName', memoName)

    uploadStatusText.value = 'Uploading...'

    const response = await httpClient.post(
      `/memos/${encodeURIComponent(memoName)}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: abortController.value.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
          }
        }
      }
    )

    if (response.data?.success && response.data?.avatarUrl) {
      model.value = response.data.avatarUrl
      uploadStatusText.value = 'Upload complete!'
      ElMessage.success('Logo uploaded successfully')
    } else {
      ElMessage.error(response.data?.error || 'Upload failed')
    }

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      uploadStatusText.value = 'Upload cancelled'
      ElMessage.info('Upload cancelled')
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      uploadError.value = errorMessage
      uploadStatusText.value = 'Upload failed'
      ElMessage.error(`Failed to upload logo: ${errorMessage}`)
    }
  } finally {
    isUploading.value = false
    abortController.value = null

    // Clear progress after delay
    setTimeout(() => {
      if (!isUploading.value) {
        uploadProgress.value = 0
        uploadStatusText.value = ''
      }
    }, 2000)
  }
}

const cancelUpload = () => {
  if (abortController.value) {
    abortController.value.abort()
  }
}

const retryUpload = () => {
  if (pendingFile.value) {
    uploadError.value = ''
    performUpload(pendingFile.value)
  }
}

const removeAvatar = async () => {
  if (props.disabled) return

  try {
    await httpClient.delete(`/memos/${encodeURIComponent(memoName)}/avatar`)
    model.value = undefined
    ElMessage.success('Logo removed')
  } catch (error) {
    ElMessage.error(`Failed to remove logo: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
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

.upload-error {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: var(--el-color-danger-light-9);
  border-radius: 4px;
}
</style>