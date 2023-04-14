<template>
  <el-menu class="el-menu-demo" mode="horizontal"
           :ellipsis="false">
    <el-menu-item index="1">AI Chat Manager</el-menu-item>

    <div class="flex-grow" />

    <el-menu-item @click="toggleDark()">
      <button class="border-none w-full bg-transparent cursor-pointer"
          style="height: var(--ep-menu-item-height)">
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>

    <el-menu-item index="2" v-if="isLogin" @click="logout()"><el-icon><User /></el-icon>退出登陆</el-menu-item>
    <div></div>
  </el-menu>
</template>

<script lang="ts" setup>
import { toggleDark } from "~/composables";
import {inject} from "vue";
import {
  User
} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
const router = useRouter();

const isLogin = inject('isLogin');

const logout = () => {
  window.localStorage.removeItem("token");
  isLogin.value = false;
  router.push({name: 'login',});
}
</script>

