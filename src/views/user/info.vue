<template>
  <div class="page-title">账号信息</div>
  <el-row class="row-space" :gutter="10">
    <el-col :span="5">
      <el-input v-model="keyword" placeholder="输入用户关键词进行搜索" clearable/>
    </el-col>
    <el-col :span="3">
      <el-button type="primary" :icon="Search" @click="query()" :loading="queryLoading">查询
      </el-button>
    </el-col>
  </el-row>

  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="accountId" label="ID"/>
    <el-table-column prop="name" label="账号名"/>
    <el-table-column prop="phone" label="电话号"/>
    <el-table-column prop="uniqueCode" label="唯一标识"/>
    <el-table-column prop="sex" label="性别"/>
    <el-table-column prop="state" label="状态"/>
    <el-table-column prop="isAdminStr" label="管理员"/>
    <el-table-column label="操作" fixed="right">
      <template #default="scope">
        <el-row class="row-space" v-if="scope.row.state==='正常'">
          <el-button link type="primary" @click="disable(scope.row)">禁用</el-button>
        </el-row>
        <el-row class="row-space" v-if="scope.row.isAdmin">
          <el-button link type="primary" @click="setAdmin(scope.row,false)">取消管理员</el-button>
        </el-row>
        <el-row class="row-space" v-if="!scope.row.isAdmin">
          <el-button link type="primary" @click="setAdmin(scope.row,true)">设置管理员</el-button>
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
  name: "user"
}
</script>

<script setup lang="ts">
import {Search, ArrowRight, ArrowLeft} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";
import {ElMessage} from "element-plus";

const disable = (row) => {
  let param = {
    'id': row.accountId
  }
  request('api/admin/user/disableUser', param, 'post').then((response) => {
    if (response.data.code == 200) {
      if (response.data.success) {
        ElMessage({message: '保存成功', type: 'success'});
      }
    }
    query();
  })
}

const setAdmin = (row, isAdd) => {
  let param = {
    'accountId': row.accountId,
    'isAdd': isAdd
  }
  request('api/auth/setAdmin', param, 'post').then((response) => {
    if (response.data.code == 200) {
      if (response.data.success) {
        ElMessage({message: '保存成功', type: 'success'});
      }
    }
    query();
  })
}

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
        tableData.value.forEach((item) => {
          item.sex = parseSex(item.sex);
          item.state = parseState(item.state);
          item.isAdminStr = item['isAdmin'] ? '是' : '否';
        })
        hasRightPage.value = pageParam.value.size == tableData.value.length;
        hasLeftPage.value = pageParam.value.page > 1;
      });
}

const parseState = (state) => {
  switch (state) {
    case 0:
      return '正常';
    case 1:
      return '禁用';
    case 2:
      return '删除';
    case 3:
      return '未激活';
    default:
      return '未知';
  }
}

const parseSex = (sex) => {
  switch (sex) {
    case 1:
      return '男';
    case 2:
      return '女';
    default:
      return '未知';
  }
}

query();
</script>
