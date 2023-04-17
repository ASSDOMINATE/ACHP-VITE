<template>
  <div class="page-title">场景项管理</div>

  <el-row class="row-space" :gutter="24">
    <el-col :span="4">
      <el-input v-model="queryTitle" placeholder="名称" clearable/>
    </el-col>
    <el-select :span="4" v-model="queryDel" placeholder="是否删除">
      <el-option label="全部" value="-1"/>
      <el-option label="删除" value="1"/>
      <el-option label="未删除" value="0"/>
    </el-select>
    <el-col :span="3">
      <el-button type="primary" :icon="Search" @click="query()" :loading="queryLoading">查询</el-button>
    </el-col>
    <el-col :span="3">
      <el-button type="primary" :icon="CirclePlus" @click="add()" :loading="queryLoading">新增</el-button>
    </el-col>
  </el-row>

  <el-table :data="tableData" stripe border empty-text="暂时没有数据" style="width: 100%" height="29rem">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="title" label="名称"/>
    <el-table-column prop="desr" label="描述"/>
    <el-table-column prop="notice" label="提示"/>
    <el-table-column prop="createTime" label="创建时间"/>
    <el-table-column prop="updateTime" label="更新时间"/>
    <el-table-column prop="delShow" label="删除"/>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button link type="primary" @click="getInfo(scope.row)">编辑</el-button>
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

  <el-dialog
      v-model="showDetail"
      title="场景详情"
      width="50%"
      top="1vh"
  >
    <el-switch
        v-model="sceneEnabled"
        inline-prompt
        size="large"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="启用"
        inactive-text="删除"
    />
    <el-row class="row-space">
      <el-text>标题</el-text>
      <el-input v-model="sceneInfo.title" size="large"></el-input>
    </el-row>
    <el-row class="row-space">
      <el-text>描述</el-text>
      <el-input v-model="sceneInfo.desr" :rows="2"
                type="textarea"></el-input>
    </el-row>
    <el-row class="row-space">
      <el-text>发送提示</el-text>
      <el-input v-model="sceneInfo.notice" :rows="2"
                type="textarea"></el-input>
    </el-row>

    <el-row class="row-space">
      <el-col :span="3">关联场景</el-col>
      <el-col :span="21">
        <el-checkbox-group v-model="selectScenes">
          <el-checkbox v-for="item in categoryScenes" :key="item.id" :label="item.id" border>
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-divider/>
    <el-row class="row-space">
      <el-col :span="3">关联角色</el-col>
      <el-col :span="21">
        <el-checkbox-group v-model="selectRoles">
          <el-checkbox v-for="item in categoryRoles" :label="item.id" :key="item.id" border>
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-divider/>
    <el-row class="row-space">
      <el-text>设置参数类型</el-text>
    </el-row>
    <el-card shadow="always" class="row-space" v-for="(item,index) in sceneInfo.items">
      <div class="one-scene-item">
        <el-row :gutter="24" type="flex">
          <el-col :span="6">
            <el-input placeholder="页面参数排序值" v-model="item.seq"/>
          </el-col>
        </el-row>
        <el-row class="row-space-small">
          <el-select v-model="item.type" placeholder="选择类型" :disabled="item.disabledType">
            <el-option label="输入框" value="1"></el-option>
            <el-option label="单选" value="2"></el-option>
            <el-option label="多选" value="3"></el-option>
            <el-option label="字数限制" value="4"></el-option>
          </el-select>
        </el-row>
        <el-row class="row-space-small">
          <el-input v-model="item.title" placeholder="参数标题"/>
        </el-row>
        <el-row class="row-space-small" v-if="item.type==='1'">
          <el-input v-model="item.content.value" placeholder="输入框默认值"/>
        </el-row>
        <el-row class="row-space-small" v-if="item.type==='2'||item.type==='3'">
          <el-tag v-for="words in item.content.selectWords" class="one-item-select"
                  :key="words"
                  closable
                  :disable-transitions="false"
                  @close="deleteItemType(item,words)">
            {{ words }}
          </el-tag>
          <el-input style="width: 80px"
                    v-if="item.inputVisible"
                    v-model="item.inputValue"
                    size="small"
                    @keyup.enter="handleInputConfirm(item)"
                    @blur="handleInputConfirm(item)"
          />
          <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(item)">
            + 选项
          </el-button>
        </el-row>
        <el-row class="row-space-small" v-if="item.type==='4'">
          <el-input v-model="item.content.value" placeholder="字数限制"/>
        </el-row>
        <el-row :gutter="24" class="row-space-small">
          <el-col :span="6">
            <el-input placeholder="拼接规则排序值" v-model="getItemConfig(index).seq"/>
          </el-col>
          <el-col :span="9">
            <el-input placeholder="拼接开头" v-model="getItemConfig(index).start"/>
          </el-col>
          <el-col :span="9">
            <el-input placeholder="拼接结尾" v-model="getItemConfig(index).end"/>
          </el-col>
        </el-row>

      </div>

      <el-button style="width: 50px;" :icon="CircleClose" type="danger" @click="removeItem(item)">删除</el-button>
    </el-card>
    <el-button clas="flex" :icon="CirclePlusFilled" @click="addItem">新增参数</el-button>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDetail=false">取消</el-button>
        <el-button type="primary" @click="saveDetail()">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<style>
.one-item-select {
  margin-right: 1rem;
}

</style>
<script lang="ts">
export default {
  name: "scene",
}
</script>

<script setup lang="ts">
import {Search, ArrowRight, ArrowLeft, CirclePlusFilled, CircleClose, CirclePlus} from '@element-plus/icons-vue'
import {ref} from "vue";
import {request} from "~/request";
import {ElInput, ElMessage} from "element-plus";

const getItemConfig = (index) => {
  return sceneInfo.value.configs[index];
}

const showInput = (item) => {
  item.inputVisible = true
}

const handleInputConfirm = (item) => {
  if (item.inputValue) {
    item.content.selectWords.push(item.inputValue);
  }
  item.inputVisible = false
  item.inputValue = ''
}

const selectScenes = ref([]);
const categoryScenes = ref([]);
const selectRoles = ref([]);
const categoryRoles = ref([]);

const sceneInfo = ref();
const sceneEnabled = ref(false);

const deleteItemType = (item, words) => {
  item.content.selectWords.splice(item.content.selectWords.indexOf(words), 1);
}

const removeItem = (item) => {
  let removeIndex = 0;
  for (let i = 0; i < sceneInfo.value.items.length; i++) {
    if (item.id == sceneInfo.value.items[i].id) {
      removeIndex = i;
      break;
    }
  }
  sceneInfo.value.items.splice(removeIndex, 1);
  sceneInfo.value.configs.splice(removeIndex, 1);
}

const addItem = () => {
  sceneInfo.value.items.push({
    'content': {
      'value': '',
      'max': '',
      'selectWords': [],
      'maxSelected': 0
    }
  });
  selectRoles.value = [];
  selectScenes.value = [];
  sceneInfo.value.configs.push({});
}
const saveDetail = () => {
  let items = [];
  let configs = [];
  for (let i = 0; i < sceneInfo.value.items.length; i++) {
    let item = sceneInfo.value.items[i];
    items.push({
      'type': item.type,
      'title': item.title,
      'seq': item.seq,
      'content': JSON.stringify(item.content), // JSON {"value":""} {"max": 200} {"maxSelected": 3, "selectWords": ["1", "2", "3"]}
    })
    let config = sceneInfo.value.configs[i];
    configs.push({
      'start': config.start,
      'end': config.end,
      'seq': config.seq
    })
  }


  let categoryIds = [];
  selectScenes.value.forEach((id) => {
    categoryIds.push(id)
  });
  selectRoles.value.forEach((id) => {
    categoryIds.push(id)
  });

  let param = {
    "id": sceneInfo.value.id,
    "title": sceneInfo.value.title,
    "desr": sceneInfo.value.desr,
    "notice": sceneInfo.value.notice,
    "del": !sceneEnabled.value,
    "items": items,
    "configs": configs,
    "categoryIds": categoryIds,
  }
  request("api/admin/scene/saveInfo", param, 'post').then((response) => {
    if (!response.data.success) {
      return;
    }
    ElMessage({message: '保存成功', type: 'success'});
    query();
  });
}

const add = () => {
  showDetail.value = true;
  sceneInfo.value = {
    "id": null,
    "title": "",
    "desr": "",
    "notice": "",
    "items": [],
    "configs": [],
    "categories": [],
  }
}

const getInfo = (row) => {
  let param = {
    'id': row.id
  }
  request("api/admin/scene/info", param, 'get').then((response) => {
    if (!response.data.success) {
      return;
    }
    showDetail.value = true;
    selectScenes.value = [];
    selectRoles.value = [];

    sceneInfo.value = response.data.data;
    sceneEnabled.value = !row.del;
    sceneInfo.value.items.forEach((item) => {
      item.type = item.type.toString();
      item.content = JSON.parse(item.content);
      item.disabledType = true;
    })
    sceneInfo.value.categories.forEach((item) => {
      switch (item.type) {
        case 1:
          selectScenes.value.push(item.id);
          break;
        case 2:
          selectRoles.value.push(item.id);
          break;
        default:
          break;
      }
    })
  })
}

const loadCategory = () => {
  let categoryParam = {
    'page': 1,
    'size': 200,
    'del': false
  }
  request('api/admin/scene/category', categoryParam, 'get').then((response) => {
    response.data.data.forEach((item) => {
      switch (item.type) {
        case 1:
          categoryScenes.value.push({'id': item.id, 'name': item.name});
          break;
        case 2:
          categoryRoles.value.push({'id': item.id, 'name': item.name});
          break;
        default:
          break;
      }
    })

  })
}
loadCategory();

const showDetail = ref(false);


const queryTitle = ref();
const queryDel = ref();
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

  let param = {
    'page': pageParam.value.page,
    'size': pageParam.value.size,
    'title': queryTitle.value,
    'del': queryDel.value === "-1" ? null : queryDel.value,
  }

  request('api/admin/scene/list',param, 'get')
      .then((response) => {
        tableData.value = response.data.data;
        queryLoading.value = false;
        hasRightPage.value = pageParam.value.size == tableData.value.length;
        hasLeftPage.value = pageParam.value.page > 1;

        tableData.value.forEach((item) => {
          item.delShow = item.del ? '是' : '否';
          item.createTime = new Date(item.createTime).toLocaleString();
          item.updateTime = new Date(item.updateTime).toLocaleString();
        })
      });
}


query();

</script>
