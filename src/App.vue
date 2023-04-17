<template>
  <el-config-provider namespace="ep">
    <BaseHeader/>
    <div style="display: flex">
      <BaseSide v-if="isLogin"/>
      <div id="body">
        <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<style>

#body {
  padding: 2rem;
  width: 100%;
  height: 100%;
}

.ep-menu--vertical{
  height:90vh;
}

</style>

<script setup lang="ts">
import {provide, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const isLogin = ref(false);
provide('isLogin',isLogin);

const checkLogin = () => {
  let token = window.localStorage.getItem("token");
  if (!token) {
    isLogin.value = false;
    router.push({name: 'login',});
    return;
  }
  isLogin.value = true;
}

checkLogin();




</script>
