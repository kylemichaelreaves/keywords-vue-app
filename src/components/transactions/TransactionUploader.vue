<template>
  <h3>Transaction Uploader</h3>
  <el-upload
      v-model:file-list="fileList"
      :action="API_GATEWAY_URL"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :limit="1"
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">
        upload a csv file; insert into the Transactions table
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {UploadProps, UploadUserFile} from 'element-plus'

const API_GATEWAY_URL: string = import.meta.env.VITE_APIGATEWAY_URL + '/transactions/upload-csv';

const TransactionUploader = defineComponent({
  setup() {

    const fileList = ref<UploadUserFile[]>([])

    const handleRemove: UploadProps['onRemove'] = (file: UploadUserFile, fileList: UploadUserFile[]) => {
      console.log(file, fileList);
    };

    const handlePreview: UploadProps['onPreview'] = (file: UploadUserFile) => {
      console.log(file);
    };

    const handleExceed: UploadProps['onExceed'] = (files: UploadUserFile[], fileList: UploadUserFile[]) => {
      console.log(files, fileList);
    };

    interface CustomUploadUserFile extends UploadUserFile {
      uid: number;
    }


    const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
      // Ensure that only the last added file is kept
      fileList.value = uploadFiles.map(file => {
        file.uid = file.uid || Date.now();
        return file as CustomUploadUserFile;
      }).slice(-1);
    };

    const beforeRemove = (file: UploadUserFile, fileList: UploadUserFile[]) => {
      console.log(file, fileList);
      return true;
    };

    return {
      fileList,
      handleChange,
      handleRemove,
      handlePreview,
      handleExceed,
      beforeRemove,
      API_GATEWAY_URL
    }
  }
})

export default TransactionUploader
</script>

<style scoped>
</style>