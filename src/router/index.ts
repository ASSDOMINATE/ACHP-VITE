import {createRouter, createWebHistory, RouterOptions} from "vue-router";

// 路由类型:RouteRecordRaw
const routes: ({ path: string; component: () => Promise<{}>; name: string } | { path: string; component: () => Promise<{ readonly default?: { name: string } }>; name: string })[] = [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/login.vue"),
    },
    {
        path: "/scene",
        name: "scene",
        component: () => import("../views/scene/scene.vue"),
    },
    {
        path: "/sceneCategory",
        name: "sceneCategory",
        component: () => import("../views/scene/category.vue"),
    },
    {
        path: "/sendConfig",
        name: "sendConfig",
        component: () => import("../views/base/sendConfig.vue"),
    },
    {
        path: "/keyConfig",
        name: "keyConfig",
        component: () => import("../views/base/keyConfig.vue"),
    },
    {
        path: "/card",
        name: "card",
        component: () => import("../views/card/card.vue"),
    },
    {
        path: "/cardPayment",
        name: "cardPayment",
        component: () => import("../views/card/payment.vue"),
    },
    {
        path: "/cardRecord",
        name: "cardRecord",
        component: () => import("../views/card/record.vue"),
    },
    {
        path: "/userInfo",
        name: "userInfo",
        component: () => import("../views/user/info.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
} as RouterOptions);

export default router;