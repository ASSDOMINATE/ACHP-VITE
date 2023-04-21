<template>
  <el-main>
    <div id="login-area">
      <div class="login-title">后台管理系统</div>
      <el-row class="row-space">
        <el-input v-model="sign" placeholder="请输入账号" clearable/>
      </el-row>
      <el-row class="row-space">
        <el-input v-model="pwd" type="password" placeholder="请输入密码" show-password/>
      </el-row>
      <el-button class="login-button" type="primary" @click="login()" :loading="onLogin">登陆</el-button>
    </div>
  </el-main>
</template>

<script lang="ts">
export default {
  name: "login"
}
</script>

<script setup lang="ts">
import {inject, ref} from 'vue'
import {request} from "~/request";
import {useRouter} from "vue-router";

const router = useRouter();

const isLogin = inject('isLogin');

const sign = ref('')
const pwd = ref('')
const onLogin = ref(false);

const login = () => {
  if (!sign.value || !pwd.value) {
    return;
  }
  if (onLogin.value) {
    return;
  }
  onLogin.value = true;
  let param = {
    'sign': sign.value,
    'pwd': pwd.value,
    'platform': 0,
    'skipPerm': false
  }
  request("api/auth/login", param, 'post')
      .then((response) => {
        onLogin.value = false;
        if (response.data.code != 200) {
          return;
        }
        window.localStorage.setItem("token", response.data.data);
        check();
      });
}

const check = () => {
  let token = window.localStorage.getItem("token");
  if (!token) {
    return;
  }
  // TODO 可以再加一个校验用户状态的接口
  isLogin.value = true;
  router.push({name: 'scene',});
}


check();

</script>

<style>
#login-area {
  text-align: center;
  width: 265px;
  padding: 30px 70px;
  margin: 6rem auto;
  --tw-shadow-color: 0 0 #0000;
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  --tw-bg-opacity: 1;
  border-radius: 5px;
  border: 1px solid #e9e9e9;
}

.dark #login-area {
  border: 1px solid #4c4d4f;
}

.login-title {
  text-align: left;
  font-size: 20px;
  margin-bottom: 30px;
}

.row-space {
  margin-bottom: 1.65rem;
}

.login-button {
  width: 100% !important;
  letter-spacing: 0.3rem;
  margin-bottom: 20px;
  margin-top: 15px;
}
</style>