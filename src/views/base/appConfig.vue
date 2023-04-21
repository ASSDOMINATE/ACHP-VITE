<template>
  <div class="page-title">APP配置</div>

  <el-row class="row-space">
    <el-button type="primary" :icon="Refresh" @click="refresh()" :loading="queryLoading">刷新</el-button>
  </el-row>

  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="version" label="版本"/>
    <el-table-column prop="exchange" label="开启兑换">
      <template #default="scope">
        <el-radio-group v-model="scope.row.exchange" size="small">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column prop="needUpdate" label="版本更新">
      <template #default="scope">
        <el-radio-group v-model="scope.row.needUpdate" size="small">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column prop="updateInfo" label="更新信息">
      <template #default="scope">
        <el-input v-model="scope.row.updateInfo"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="updateUrl" label="更新链接">
      <template #default="scope">
        <el-input v-model="scope.row.updateUrl"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button link type="primary" @click="save(scope.row)">保存</el-button>
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
import {Refresh, CirclePlus} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";
import {ElMessage} from "element-plus";

const tableData = ref([]);
const queryLoading = ref(false);


const refresh = () => {
  queryLoading.value = true;
  request('api/admin/base/appConfig', '', 'get').then((response) => {
    tableData.value = response.data.data;
    tableData.value.forEach((row) => {
      row.exchange = row.exchange ? row.exchange.toString() : 'false';
      row.needUpdate = row.needUpdate ? row.needUpdate.toString() : 'false';
    })
    queryLoading.value = false;
  })
}

refresh();

const save = (row) => {
  request('api/admin/base/setAppConfig', row, 'post').then((response) => {
    if (response.data.success) {
      ElMessage({message: '保存成功', type: 'success'});
    }
    refresh();
  })

}


</script>
