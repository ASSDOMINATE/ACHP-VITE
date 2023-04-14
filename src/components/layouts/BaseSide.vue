<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >

    <el-sub-menu index="1">
      <template #title>
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </template>
        <el-menu-item index="1-1" @click="toPage('userInfo')">账号信息</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="2">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>场景管理</span>
      </template>
      <el-menu-item index="2-2" @click="toPage('scene')">场景项</el-menu-item>
      <el-menu-item index="2-1" @click="toPage('sceneCategory')">场景分类</el-menu-item>
    </el-sub-menu>


    <el-sub-menu index="3">
      <template #title>
        <el-icon><Key /></el-icon>
        <span>卡密配置</span>
      </template>
      <el-menu-item index="3-1" @click="toPage('card')">卡密套餐</el-menu-item>
      <el-menu-item index="3-2" @click="toPage('cardRecord')">卡密列表</el-menu-item>
      <el-menu-item index="3-3" @click="toPage('cardPayment')">支付记录</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="4">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </template>
      <el-menu-item index="4-1" @click="toPage('keyConfig')">API-KEY管理</el-menu-item>
      <el-menu-item index="4-2" @click="toPage('sendConfig')">对话相关配置</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";

import {
  Menu as IconMenu,
  Setting,User,Key
} from "@element-plus/icons-vue";

const router = useRouter();


const handleOpen = (key: string, keyPath: string[]) => {
};
const handleClose = (key: string, keyPath: string[]) => {
};

const toPage = (url: string) => {
  router.push({
    name: url,
  });
};
</script>
