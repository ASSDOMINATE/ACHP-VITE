<template>
  <div class="page-title">卡密套餐</div>

  <el-row class="row-space">
    <el-button type="primary" :icon="Refresh" @click="refresh()" :loading="queryLoading">刷新</el-button>
    <el-button type="primary" :icon="CirclePlus" @click="add()" :loading="queryLoading" :disabled="showAddRow">增加
    </el-button>
  </el-row>
  <el-table :data="tableData" table-layout="auto" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="id" label="ID" width="50px"/>
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
    <el-table-column prop="balance" label="价格">
      <template #default="scope">
        <el-input v-model="scope.row.balance"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="productCode" label="产品编码">
      <template #default="scope">
        <el-input v-model="scope.row.productCode"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="stock" label="库存">
      <template #default="scope">
        <el-input v-model="scope.row.stock"></el-input>
      </template>
    </el-table-column>
    <el-table-column value="type" label="类型">
      <template #default="scope">
        <el-select v-model="scope.row.type" placeholder="选择类型">
          <el-option label="天数限制" value="1"></el-option>
          <el-option label="次数限制" value="2"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="dayLimit" label="可用天数">
      <template #default="scope">
        <el-input v-if="scope.row.type==='1'" v-model="scope.row.dayLimit"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="countLimit" label="可用次数">
      <template #default="scope">
        <el-input v-if="scope.row.type==='2'" v-model="scope.row.countLimit"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="state" label="状态">
      <template #default="scope">
        <el-select v-model="scope.row.state" placeholder="选择类型">
          <el-option label="启用" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"/>
    <el-table-column prop="updateTime" label="更新时间"/>
    <el-table-column label="操作">
      <template #default="scope">
        <el-row>
          <el-button link type="primary" @click="save(scope.row)">保存</el-button>
        </el-row>
        <el-row>
          <el-button link type="primary" @click="createRecord(scope.row)">生成卡密</el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>


  <el-dialog
      v-model="createRecordDialog"
      title="生成卡密"
      width="30%"
  >
    <el-row class="row-space">
      <el-text>已生成卡密记录ID&nbsp;&nbsp;</el-text>
      [&nbsp;<el-text type="success">{{ recordId }}</el-text>&nbsp;]
      <el-text>&nbsp;&nbsp;兑换码为</el-text>
    </el-row>
    <el-row class="row-space">
      <el-text type="success">{{ recordKey }}</el-text>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="createRecordDialog=false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "card"
}
</script>

<script setup lang="ts">
import {Refresh, CirclePlus} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";
import {ElMessage} from "element-plus";

const save = (row) => {
  let param = {
    'id': row.id,
    'name': row.name,
    'desr': row.desr,
    'balance': row.balance,
    'productCode': row.productCode,
    'type': row.type,
    'countLimit': row.countLimit,
    'dayLimit': row.dayLimit,
    'stock': row.stock,
    'state': row.state,
  }
  request("api/admin/card/saveCard", param, 'post').then((response) => {
    if (response.data.code == 200) {
      if (response.data.success) {
        ElMessage({message: '保存成功', type: 'success'});
      }
      refresh();
    }
  })
}

const createRecordDialog = ref(false);
const recordId = ref(0);
const recordKey = ref("")
const createRecord = (row) => {
  let param = {
    'id': row.id
  }
  request("api/admin/card/createCardRecord", param, 'post').then((response) => {
    if (response.data.code != 200) {
      return;
    }
    if (response.data.success) {
      createRecordDialog.value = true;
      recordId.value = response.data.data.id;
      recordKey.value = response.data.data.exchangeKey;
    }
  })
}

const showAddRow = ref(false);
const add = () => {
  if (showAddRow.value) {
    return;
  }
  showAddRow.value = true;
  tableData.value.unshift({});
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
        showAddRow.value = false;
        tableData.value.forEach((item) => {
          item.type = item.type.toString();
          item.state = item.state.toString();
          item.createTime = new Date(item.createTime).toLocaleString();
          item.updateTime = new Date(item.updateTime).toLocaleString();
        })
      });
}


refresh();

</script>

