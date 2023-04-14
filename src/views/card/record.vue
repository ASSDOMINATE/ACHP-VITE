<template>
  <div class="page-title">卡密记录</div>

  <el-row class="row-space">
    <el-button type="primary" :icon="Search" @click="query()" :loading="queryLoading">查询</el-button>
  </el-row>

  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="accountId" label="账号ID"/>
    <el-table-column prop="cardId" label="卡密ID"/>
    <el-table-column prop="cardName" label="卡密名称"/>
    <el-table-column prop="cardType" label="卡密类型"/>
    <el-table-column prop="exchangeKey" label="兑换卡密"/>
    <el-table-column prop="remainCount" label="剩余次数"/>
    <el-table-column prop="requestCount" label="请求次数"/>
    <el-table-column prop="startTime" label="开始时间"/>
    <el-table-column prop="expireTime" label="到期时间"/>
    <el-table-column prop="state" label="状态"/>
    <el-table-column prop="createTime" label="创建时间"/>
    <el-table-column prop="updateTime" label="更新时间"/>
  </el-table>
  <el-button-group class="row-space">
    <el-button type="primary" :icon="ArrowLeft" :disabled="!hasLeftPage" @click="prevQuery()">上一页</el-button>
    <el-button type="primary" :icon="ArrowRight" :disabled="!hasRightPage" @click="nextQuery()">下一页</el-button>
  </el-button-group>
</template>

<script lang="ts">
export default {
  name: "cardRecord"
}
</script>

<script setup lang="ts">
import {Search, ArrowRight, ArrowLeft} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";

const tableData = ref([]);
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
  hasLeftPage.value = false;
  hasRightPage.value = false;
  queryLoading.value = true;
  request('api/admin/card/cardRecordList', pageParam.value, 'get')
      .then((response) => {
        tableData.value = response.data.data;
        queryLoading.value = false;
        hasRightPage.value = pageParam.value.size == tableData.value.length;
        hasLeftPage.value = pageParam.value.page > 1;
        tableData.value.forEach((item) => {
          item.cardType = item.cardType == '1' ? '天数限制' : '次数限制';
          item.state = recordState(item.state);
          item.startTime = formatTime(new Date(item.startTime).toLocaleString());
          item.expireTime = formatTime(new Date(item.expireTime).toLocaleString());
          item.createTime = new Date(item.createTime).toLocaleString();
          item.updateTime = new Date(item.updateTime).toLocaleString();
        })
      });
}

const formatTime = (timeStr)=>{
  let target = new Date(timeStr).toLocaleString()
  if('1970/1/1 08:00:00' === target){
    return '-';
  }
  return target;
}

const recordState = (code) => {
  switch (code) {
    case 0:
      return "未使用";
    case 1:
      return "使用中";
    case 2:
      return "已使用";
    default:
      return "禁用";
  }
}


query();

</script>
<style scoped>

</style>