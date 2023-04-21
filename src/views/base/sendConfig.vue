<template>
  <div class="page-title">对话相关配置</div>

  <el-row class="row-space send-config" :gutter="10">
    <el-col :span="9">
      <el-input size="large" v-model="requestLimit"
                placeholder="免费账号每日请求次数限制，0 代表不限制">
        <template #prepend>次数限制</template>
      </el-input>
    </el-col>
  </el-row>
  <el-row class="row-space send-config" :gutter="10">
    <el-col :span="9">
      <el-input size="large" v-model="freqLimit"
                placeholder="免费账号请求频率限制，单位秒">
        <template #prepend>频率限制</template>
      </el-input>
    </el-col>
  </el-row>
  <el-row class="row-space send-config" :gutter="10">
    <el-col :span="9">
      <el-input size="large" v-model="setSystem"
                placeholder="系统预设角色描述">
        <template #prepend>预设描述</template>
      </el-input>
    </el-col>
  </el-row>
  <el-row class="row-space send-config" :gutter="10">
    <el-col :span="9">
      <el-input size="large" v-model="temperature"
                placeholder="模型的热度值，范围 0-2">
        <template #prepend>模型热度</template>
      </el-input>
    </el-col>
  </el-row>
  <el-row class="row-space send-config" :gutter="10">
    <el-col :span="9">
      <el-input size="large" v-model="maxResultTokens"
                placeholder="限制返回结果最大Token值">
        <template #prepend>结果Tokens限制</template>
      </el-input>
    </el-col>
  </el-row>
  <el-row class="row-space send-config" :gutter="10">
    <el-col :span="9">
      <el-input size="large" v-model="modelId"
                placeholder="输入ChatGPT模型ID，默认模型ID为 gpt-3.5-turbo">
        <template #prepend>对话模型</template>
      </el-input>
    </el-col>
  </el-row>
  <el-row class="row-space">
    <el-button type="primary" :icon="FolderChecked" @click="save()" :loading="queryLoading">保存</el-button>
    <el-button type="primary" :icon="Refresh" @click="refresh()" :loading="queryLoading">刷新</el-button>
  </el-row>
</template>

<script lang="ts">
export default {
  name: "sendConfig"
}
</script>

<script setup lang="ts">
import {FolderChecked, Refresh} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {request} from "~/request";
import {ElMessage} from "element-plus";

const requestLimit = ref();
const freqLimit = ref();
const modelId = ref("");
const temperature = ref();
const maxResultTokens = ref();
const queryLoading = ref(false);
const setSystem = ref("");
const save = () => {
  queryLoading.value = true;
  let param = {
    'dailyRequestLimit': requestLimit.value,
    'freqSecondLimit': freqLimit.value,
    'modelId': modelId.value,
    'maxResultTokens': maxResultTokens.value,
    'temperature': temperature.value,
    'system': setSystem.value
  }
  request('api/admin/base/updateConfig', param, 'post').then((response) => {
    if (response.data.success) {
      ElMessage({message: '保存成功', type: 'success'});
    }
    refresh();
  })
}

const refresh = () => {
  queryLoading.value = true;
  request('api/admin/base/config', '', 'get')
      .then((response) => {
        let data = response.data.data;
        requestLimit.value = data.dailyRequestLimit;
        freqLimit.value = data.freqSecondLimit;
        modelId.value = data.modelId;
        maxResultTokens.value = data.maxResultTokens;
        temperature.value = data.temperature;
        queryLoading.value = false;
      })
}

refresh();

</script>

<style>
.send-config .ep-input-group__prepend {
  color: #000;
}

.dark .send-config .ep-input-group__prepend {
  color: #fff;
}

</style>