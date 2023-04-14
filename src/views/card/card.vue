<template>
  <div class="page-title">卡密套餐</div>

  <el-row class="row-space">
    <el-button type="primary" :icon="Refresh" @click="refresh()" :loading="queryLoading">刷新</el-button>
    <el-button type="primary" :icon="CirclePlus" @click="add()" :loading="queryLoading">增加</el-button>
  </el-row>
  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="name" label="名称"/>
    <el-table-column prop="desr" label="描述"/>
    <el-table-column prop="balance" label="价格"/>
    <el-table-column prop="productCode" label="产品编码"/>
    <el-table-column prop="stock" label="库存"/>
    <el-table-column prop="type" label="类型"/>
    <el-table-column prop="dayLimit" label="可用天数"/>
    <el-table-column prop="countLimit" label="可用次数"/>
    <el-table-column prop="createTime" label="创建时间"/>
    <el-table-column prop="updateTime" label="更新时间"/>
  </el-table>

</template>

<script lang="ts">
export default {
  name: "card"
}
</script>

<script setup lang="ts">
import {Refresh,CirclePlus} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";

const add = () => {
  
}

const tableData = ref([]);
const queryLoading = ref(false);

const refresh = () => {
  if (queryLoading.value) {
    return;
  }
  queryLoading.value = true;
  request('api/admin/card/card', '', 'get')
      .then((response) => {
        tableData.value = response.data.data;
        queryLoading.value = false;
        tableData.value.forEach((item) => {
          item.type = item.type == '1' ? '天数限制' : '次数限制';
          item.createTime = new Date(item.createTime).toLocaleString();
          item.updateTime = new Date(item.updateTime).toLocaleString();
        })

      });
}

refresh();

</script>

<style scoped>

</style>