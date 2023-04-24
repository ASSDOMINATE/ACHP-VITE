<template>
  <div class="page-title">APP提醒设置</div>
  <el-row class="small-row-space"><el-text>问候语设置</el-text></el-row>
  <el-row class="row-space send-config" :gutter="10">
    <el-col :span="9">
      <el-input size="large" v-model="greetings" placeholder="可发送消息的用户打开APP的问候语"/>
    </el-col>
  </el-row>
  <el-row class="small-row-space">
    <el-text style="margin-right: 1rem;">提醒语设置</el-text>
    <el-button type="primary" :icon="CirclePlus" @click="addRemind()" style="width: 100px">新增提醒</el-button>
  </el-row>
  <el-row class="row-space">
    <el-card shadow="always" class="one-remind-card" v-for="(item,index) in remindList">
      <el-row class="small-row-space">
        <el-input size="large" v-model="item.title" placeholder="提醒标题"/>
      </el-row>
      <el-row class="small-row-space">
        <el-input type="textarea" size="large" v-model="item.content" placeholder="提醒内容"/>
      </el-row>
      <el-row class="small-row-space">
        <el-select v-model="item.isDisposable" placeholder="是否为一次性提醒">
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
      </el-row>
      <el-button style="width: 50px;" :icon="CircleClose" type="danger" @click="removeRemind(index)">删除</el-button>
    </el-card>
  </el-row>
  <el-row class="row-space">
    <el-button type="primary" :icon="FolderChecked" @click="save()" :loading="queryLoading">保存</el-button>
    <el-button type="primary" :icon="Refresh" @click="refresh()" :loading="queryLoading">刷新</el-button>

  </el-row>
</template>

<script lang="ts">
export default {
  name: "noticeConfig"
}
</script>

<script setup lang="ts">
import {CirclePlus, FolderChecked, Refresh, CircleClose} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {request} from "~/request";
import {ElMessage} from "element-plus";

const greetings = ref();
const remindList = ref([]);
const queryLoading = ref(false);

const removeRemind = (index) => {
  remindList.value.splice(index, 1);
}

const addRemind = () => {
  remindList.value.push({
    'title': '',
    'content': '',
    'isDisposable': '',
  })
  console.log(remindList.value);
}

const save = () => {
  queryLoading.value = true;
  let param = {
    'greetings': greetings.value,
    'remindList': remindList.value
  }
  request('api/admin/base/setAppNotice', param, 'post').then((response) => {
    if (response.data.success) {
      ElMessage({message: '保存成功', type: 'success'});
    }
    refresh();
  })
}

const refresh = () => {
  queryLoading.value = true;
  request('api/admin/base/appNotice', '', 'get')
      .then((response) => {
        let data = response.data.data;
        greetings.value = data.greetings;
        remindList.value = data.remindList;
        remindList.value.forEach((item) => {
          item.isDisposable = item.isDisposable.toString();
        })
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

.small-row-space {
  margin-bottom: 0.5rem;
}

.one-remind-card {
  margin-right: 1rem;
  margin-bottom: 1rem;
}

</style>