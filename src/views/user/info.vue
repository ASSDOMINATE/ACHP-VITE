<template>
  <div class="page-title">账号信息</div>
  <el-row class="row-space">
    <el-input v-model="keyword" placeholder="输入用户关键词进行搜索" clearable class="w-50" size="large"/>
    <el-button style="margin-top: 10px;" type="primary" :icon="Search" @click="query()" :loading="queryLoading">查询</el-button>
  </el-row>

  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="26rem">
    <el-table-column prop="accountId" label="ID"/>
    <el-table-column prop="name" label="账号名"/>
    <el-table-column prop="phone" label="电话号"/>
    <el-table-column prop="uniqueCode" label="唯一标识"/>
  </el-table>

  <el-button-group class="row-space">
    <el-button type="primary" :icon="ArrowLeft" :disabled="!hasLeftPage" @click="prevQuery()">上一页</el-button>
    <el-button type="primary" :icon="ArrowRight" :disabled="!hasRightPage" @click="nextQuery()">下一页</el-button>
  </el-button-group>
</template>

<script lang="ts">
export default {
  name: "user"
}
</script>

<script setup lang="ts">
import {Search, ArrowRight, ArrowLeft} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";

const tableData = ref([]);
const keyword = ref("");
const queryLoading = ref(false);
const hasLeftPage = ref(false);
const hasRightPage = ref(false);
const pageParam = ref({
  page: 1,
  size: 10,
})

const prevQuery = () => {
  pageParam.value.page = pageParam.value.page - 1
  query();
}

const nextQuery = () => {
  pageParam.value.page = pageParam.value.page + 1
  query();
}

const query = () => {
  if (queryLoading.value) {
    return;
  }
  if (keyword.value) {
    hasLeftPage.value = false;
    hasRightPage.value = false;
    queryLoading.value = true;
    request('api/admin/user/search', {'keyword': keyword.value}, 'get')
        .then((response) => {
          tableData.value = response.data.data;
          queryLoading.value = false;
        })
    return;
  }
  hasLeftPage.value = false;
  hasRightPage.value = false;
  queryLoading.value = true;
  request('api/admin/user/list', pageParam.value, 'get')
      .then((response) => {
        tableData.value = response.data.data;
        queryLoading.value = false;
        hasRightPage.value = pageParam.value.size == tableData.value.length;
        hasLeftPage.value = pageParam.value.page > 1;
      });
}

query();
</script>

<style scoped>

</style>