<template>
  <div class="page-title">支付记录</div>

  <el-row class="row-space">
    <el-button type="primary" :icon="Search" @click="query()" :loading="queryLoading">查询</el-button>
  </el-row>

  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="accountId" label="账号ID"/>
    <el-table-column prop="orderCode" label="系统订单号"/>
    <el-table-column prop="partyCode" label="支付订单号"/>
    <el-table-column prop="type" label="支付平台"/>
    <el-table-column prop="price" label="金额"/>
    <el-table-column prop="message" label="支付信息"/>
    <el-table-column prop="createTime" label="创建时间"/>
  </el-table>
  <el-button-group class="row-space">
    <el-button type="primary" :icon="ArrowLeft" :disabled="!hasLeftPage" @click="prevQuery()">上一页</el-button>
    <el-button type="primary" :icon="ArrowRight" :disabled="!hasRightPage" @click="nextQuery()">下一页</el-button>
  </el-button-group>

</template>

<script lang="ts">
export default {
  name: "cardPayment"
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
  request('api/admin/card/payment', pageParam.value, 'get')
      .then((response) => {
        tableData.value = response.data.data;
        queryLoading.value = false;
        hasRightPage.value = pageParam.value.size == tableData.value.length;
        hasLeftPage.value = pageParam.value.page > 1;
        tableData.value.forEach((item) => {
          item.type = payType(item.type);
          item.createTime = new Date(item.createTime).toLocaleString();
        })

      });
}

const payType = (code) => {
  switch (code) {
    case 1:
      return "支付宝";
    case 2:
      return "微信";
    case 3:
      return "苹果";
    default:
      return "未知";
  }
}

query();

</script>

<style scoped>

</style>