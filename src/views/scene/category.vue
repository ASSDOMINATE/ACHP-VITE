<template>
  <div class="page-title">场景分类管理</div>

  <el-row class="row-space">
    <el-button type="primary" :icon="Refresh" @click="refresh()" :loading="queryLoading">刷新</el-button>
    <el-button type="primary" :icon="CirclePlus" @click="add()" :loading="queryLoading" :disabled="showAddRow">增加
    </el-button>
  </el-row>

  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="type" label="类型">
      <template #default="scope">
        <el-select :disabled="scope.row.id" v-model="scope.row.type" placeholder="选择类型">
          <el-option label="场景" value="1"></el-option>
          <el-option label="角色" value="2"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称">
      <template #default="scope">
        <el-input v-model="scope.row.name"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="desr" label="描述">
      <template #default="scope">
        <el-input v-model="scope.row.desr"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"/>
    <el-table-column prop="updateTime" label="更新时间"/>
    <el-table-column prop="del" label="删除">
      <template #default="scope">
        <el-select v-model="scope.row.del" placeholder="是否删除">
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button link type="primary" @click="save(scope.row)">保存</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button-group class="row-space">
    <el-button type="primary" :icon="ArrowLeft" :disabled="!hasLeftPage" @click="prevQuery()">上一页</el-button>
    <el-button type="primary" :disabled="!hasRightPage" @click="nextQuery()">下一页<el-icon class="el-icon--right"><ArrowRight /></el-icon></el-button>
  </el-button-group>
</template>

<script lang="ts">
export default {
  name: "category"
}
</script>

<script setup lang="ts">
import {Refresh, CirclePlus, ArrowRight, ArrowLeft} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";
import {ElMessage} from "element-plus";

const tableData = ref([]);
const queryLoading = ref(false);
const hasLeftPage = ref(false);
const hasRightPage = ref(false);
const pageParam = ref({
  page: 1,
  size: 10,
})

const refresh = () => {
  if (queryLoading.value) {
    return;
  }

  hasLeftPage.value = false;
  hasRightPage.value = false;
  queryLoading.value = true;

  request('api/admin/scene/category', pageParam.value, 'get')
      .then((response) => {
        tableData.value = response.data.data;
        queryLoading.value = false;
        showAddRow.value = false;
        hasRightPage.value = pageParam.value.size == tableData.value.length;
        hasLeftPage.value = pageParam.value.page > 1;

        tableData.value.forEach((item) => {
          item.type = item.type.toString();
          item.del = item.del.toString();
          item.createTime = new Date(item.createTime).toLocaleString();
          item.updateTime = new Date(item.updateTime).toLocaleString();
        })
      });
}
refresh();

const prevQuery = () => {
  pageParam.value.page = pageParam.value.page - 1
  refresh();
}

const nextQuery = () => {
  pageParam.value.page = pageParam.value.page + 1
  refresh();
}

const showAddRow = ref(false);
const add = () => {
  if (showAddRow.value) {
    return;
  }
  showAddRow.value = true;
  tableData.value.unshift({});
}

const save = (row) => {
  console.log(row);
  let param = {
    'id': row.id,
    'name': row.name,
    'desr': row.desr,
    'type': row.type,
    'del': row.del
  }
  request('api/admin/scene/saveCategory', param, 'post').then((response) => {
    if (response.data.success) {
      ElMessage({message: '保存成功', type: 'success'});
    }
    refresh();
  })

}


</script>

