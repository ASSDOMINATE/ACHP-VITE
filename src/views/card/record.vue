<template>
  <div class="page-title">卡密记录</div>

  <el-row class="row-space" :gutter="15">
    <el-col :span="4">
      <el-input v-model="cardId" placeholder="卡密套餐ID" clearable/>
    </el-col>
    <el-col :span="4">
      <el-input v-model="exchangeKey" placeholder="兑换码" clearable/>
    </el-col>
    <el-col :span="4">
      <el-input v-model="userKeyword" placeholder="用户关键词" clearable/>
    </el-col>
    <el-col :span="4">
      <el-select v-model="selectState" placeholder="选择状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="未使用" value="0"></el-option>
        <el-option label="使用中" value="1"></el-option>
        <el-option label="已使用" value="2"></el-option>
        <el-option label="禁用" value="3"></el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" :icon="Search" @click="query()" :loading="queryLoading">查询</el-button>
    </el-col>
  </el-row>

  <el-table :data="tableData" table-layout="auto" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="id" label="ID" width="100px"/>
    <el-table-column prop="accountId" label="账号ID" width="100px"/>
    <el-table-column prop="cardId" label="卡密ID" width="70px"/>
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
    <el-table-column label="操作" fixed="right">
      <template #default="scope">
        <el-row class="row-space" v-if="scope.row.state!=='禁用'">
          <el-button link type="primary" @click="disable(scope.row)">禁用</el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
  <el-button-group class="row-space">
    <el-button type="primary" :icon="ArrowLeft" :disabled="!hasLeftPage" @click="prevQuery()">上一页</el-button>
    <el-button type="primary" :disabled="!hasRightPage" @click="nextQuery()">下一页
      <el-icon class="el-icon--right">
        <ArrowRight/>
      </el-icon>
    </el-button>
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
import {ElMessage} from "element-plus";


const disable = (row) => {
  let param = {
    'id': row.id,
  }
  request('api/admin/card/setRecordDisable', param, 'post').then((response) => {
    if (response.data.code == 200) {
      if (response.data.success) {
        ElMessage({message: '保存成功', type: 'success'});
      }
    }
    query();
  })
}


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

const cardId = ref();
const exchangeKey = ref();
const userKeyword = ref();
const selectState = ref();
const query = () => {
  if (queryLoading.value) {
    return;
  }

  let param = {
    'page': pageParam.value.page,
    'size': pageParam.value.size,
    'card_id': cardId.value,
    'exchange_key': exchangeKey.value,
    'keyword': userKeyword.value,
    'state':selectState.value
  }

  hasLeftPage.value = false;
  hasRightPage.value = false;
  queryLoading.value = true;
  request('api/admin/card/cardRecordList', param, 'get').then((response) => {
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

const formatTime = (timeStr) => {
  let target = new Date(timeStr).toLocaleString()
  if ('1970/1/1 08:00:00' === target) {
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
