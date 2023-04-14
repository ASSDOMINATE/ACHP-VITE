<template>
  <div class="page-title">对话相关配置</div>

  <el-row class="row-space">
    <el-input size="large" v-model="requestLimit"
              placeholder="免费账号每日请求次数限制，0 代表不限制">
      <template #prepend>次数限制</template>
    </el-input>
  </el-row>
  <el-row class="row-space">
    <el-input size="large" v-model="freqLimit"
              placeholder="免费账号请求频率限制，单位秒">
      <template #prepend>频率限制</template>
    </el-input>
  </el-row>
  <el-row class="row-space">
    <el-input size="large" v-model="modelId"
              placeholder="输入ChatGPT模型ID，默认模型ID为 gpt-3.5-turbo">
      <template #prepend>对话模型</template>
    </el-input>
  </el-row>
  <el-row class="row-space">
    <el-button type="primary" :icon="FolderChecked" @click="save()" :loading="queryLoading">保存</el-button>
  </el-row>
</template>

<script lang="ts">
export default {
  name: "sendConfig"
}
</script>

<script setup lang="ts">
import {FolderChecked} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {request} from "~/request";
import {ElMessage} from "element-plus";

const requestLimit = ref();
const freqLimit = ref();
const modelId = ref("");

const queryLoading = ref(false);

const save = () => {
  let param = {
    'dailyRequestLimit': requestLimit.value,
    'freqSecondLimit': freqLimit.value,
    'modelId': modelId.value
  }
  request('api/admin/base/updateConfig', param, 'post')
      .then((response) => {
        if (response.data.code != 200) {
          ElMessage({message: response.data.msg, type: 'error'});
        }else{
          ElMessage({message: response.data.msg, type: 'success'});
        }
        update();
      })
}

const update = () => {
  request('api/admin/base/config', '', 'get')
      .then((response) => {
        let data = response.data.data;
        requestLimit.value = data.dailyRequestLimit;
        freqLimit.value = data.freqSecondLimit;
        modelId.value = data.modelId;
      })
}

update();

</script>

<style>
.ep-input-group__prepend {
  color: #000;
}

.dark .ep-input-group__prepend {
  color: #fff;
}

.row-space {
  max-width: 450px !important;
}
</style>