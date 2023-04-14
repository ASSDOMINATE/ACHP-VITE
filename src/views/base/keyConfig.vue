<template>
  <div class="page-title">API-Key 管理</div>

  <el-row class="row-space">
    <el-button type="primary" :icon="Refresh" @click="refresh()" :loading="queryLoading">刷新</el-button>
  </el-row>

  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="apiKey" label="API-Key">
      <template #default="scope">
        <el-input v-model="scope.row.apiKey"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="weight" label="权重">
      <template #default="scope">
        <el-input v-model="scope.row.weight"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="state" label="状态">
      <template #default="scope">
        <el-select v-model="scope.row.state">
          <el-option label="启用" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="usedCount" label="请求次数"/>
    <el-table-column prop="createTime" label="创建时间"/>
    <el-table-column prop="updateTime" label="更新时间"/>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button link type="primary" @click="getInfo(scope.row)">保存</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
export default {
  name: "keyConfig"
}
</script>
<script setup lang="ts">
import {Refresh} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";

const tableData = ref([]);
const queryLoading = ref(false);


const refresh = () => {
  request('api/admin/base/key', '', 'get')
      .then((response) => {
        tableData.value = response.data.data;
        tableData.value.forEach((item) => {
          item.state = item.state == '0' ? '启用' : '禁用';
          item.createTime = new Date(item.createTime).toLocaleString();
          item.updateTime = new Date(item.updateTime).toLocaleString();
        })
      })
}
refresh();

const getInfo = (row) => {
  console.log(row);
}
</script>
<style scoped>

</style>