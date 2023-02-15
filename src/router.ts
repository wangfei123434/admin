import { h, defineComponent } from "vue";
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterView,
  useRoute,
} from "vue-router";
import http from "./config/http";
import store from "./store";
import NProgress from "nprogress";
import { useRouter } from "vue-router";
import { ElMessageBox, ElLoading, ElMessage } from "element-plus";
import "nprogress/nprogress.css";
const routerHistory = createWebHistory("/admin/");
export const asyncRouters: RouteRecordRaw[] = [
  // 首页
  {
    path: "/home",
    component: () => import("/@/views/home.vue"),
    meta: {
      name: "首页",
      roles: ["PERMISSION_HOME"],
      icon: "el-icon-s-home",
    },
  },
  // 用户管理
  {
    path: "/user",
    redirect: "/user/single",
    component: defineComponent({
      setup(props) {
        const route = useRoute();
        return () => h(RouterView, { key: route.path });
      },
    }),
    meta: {
      name: "用户管理",
      roles: ["PERMISSION_USER"],
      icon: "el-icon-s-custom",
    },
    children: [
      {
        path: "single",
        component: () => import("/@/views/user/single.vue"),
        meta: {
          name: "个人注册",
          roles: ["PERMISSION_USER_PERSONAL"],
        },
      },
    ],
  },
  // 新闻管理
  {
    path: "/news",
    redirect: "/news/dynamic",
    component: defineComponent({
      setup(props) {
        const route = useRoute();
        return () => h(RouterView, { key: route.path });
      },
    }),
    meta: {
      name: "内容管理",
      roles: ["PERMISSION_CMS"],
      icon: "el-icon-chat-dot-square",
    },
    children: [
      {
        path: "rcajnotice",
        component: () => import("/@/views/news/rcajnotice.vue"),
        meta: {
          name: "通知公告",
          roles: ["PERMISSION_NOTICE"],
        },
      },
      {
        path: "rcajguide",
        component: () => import("/@/views/news/rcajguide.vue"),
        meta: {
          name: "申报指南",
          roles: ["PERMISSION_GUIDE"],
        },
      },
    ],
  },
  // 窗口收件
  {
    path: "/chuangkou",
    redirect: "/chuangkou/shoujian",
    component: defineComponent({
      setup(props) {
        const route = useRoute();
        return () => h(RouterView, { key: route.path });
      },
    }),
    meta: {
      name: "窗口收件",
      roles: ["PERMISSION_CHUANGKOU"],
      icon: "el-icon-s-order",
    },
    children: [
      {
        path: "dxbys",
        component: () => import("/@/views/chuangkou/dxbys.vue"),
        meta: {
          name: "大学毕业生",
          roles: ["PERMISSION_CHUANGKOU_DXBYS"],
        },
      },
      {
        path: "gjnrc",
        component: () => import("/@/views/chuangkou/gjnrc.vue"),
        meta: {
          name: "高技能人才",
          roles: ["PERMISSION_CHUANGKOU_GJNRC"],
        },
      },
    ],
  },
  {
    path: "/person",
    redirect: "/person/collegeStudentAudit",
    component: defineComponent({
      setup(props) {
        const route = useRoute();
        return () => h(RouterView, { key: route.path });
      },
    }),
    meta: {
      name: "人才安居资格审核",
      roles: ["PERMISSION_RENT_APPLY"],
      icon: "el-icon-s-management",
    },
    children: [
      {
        path: "collegeStudentAudit",
        component: () => import("/@/views/person/collegeStudentAudit.vue"),
        meta: {
          name: "学历审核",
          roles: ["PERMISSION_USER_TALENT_AUDIT"],
        },
      },
      {
        path: "renshePage",
        component: () => import("/@/views/person/renshePage.vue"),
        meta: {
          name: "人社审核",
          roles: ["PERMISSION_RENSHE_AUDIT"],
        },
      },
      {
        path: "fangguanPage",
        component: () => import("/@/views/person/fangguanPage.vue"),
        meta: {
          name: "房管审核",
          roles: ["PERMISSION_FANGGUAN_AUDIT"],
        },
      },
      // {
      //   path: "fyManagement",
      //   component: () => import("/@/views/person/fyManagement.vue"),
      //   meta: {
      //     name: "房源管理",
      //     roles: ["PERMISSION_RENT_HOUSE_SOURCE"],
      //   },
      // },
      // {
      //   path: "pzManagement",
      //   component: () => import("/@/views/person/pzManagement.vue"),
      //   meta: {
      //     name: "配租管理",
      //     roles: ["PERMISSION_RENT_HOUSE_CONFIG"],
      //   },
      // },
      // {
      //   path: "houseManage",
      //   component: () => import("/@/views/person/houseManage.vue"),
      //   meta: {
      //     name: "选房管理",
      //     roles: ["PERMISSION_RENT_APPLY_SELECT_HOUSE"],
      //   },
      // },
      // {
      //   path: "qyManagement",
      //   component: () => import("/@/views/person/qyManagement.vue"),
      //   meta: {
      //     name: "签约管理",
      //     roles: ["PERMISSION_RENT_HOUSE_CONTRACT"],
      //   },
      // },
      // {
      //   path: "csManagement",
      //   component: () => import("/@/views/person/csManagement.vue"),
      //   meta: {
      //     name: "参数配置",
      //     roles: ["PERMISSION_RENT_HOUSE_PARAM"],
      //   },
      // },
      // {
      //   path: "signManage",
      //   component: () => import("/@/views/person/signManage.vue"),
      //   meta: {
      //     name: "签约管理",
      //   },
      // },
    ],
  },
  // 系统管理
  {
    path: "/system",
    component: defineComponent({
      setup(props) {
        return () => h(RouterView);
      },
    }),
    redirect: "/system/user",
    meta: {
      name: "系统管理",
      roles: ["PERMISSION_SYSTEM"],
      icon: "el-icon-s-tools",
    },
    children: [
      {
        path: "user",
        component: () => import("/@/views/system/user.vue"),
        meta: {
          name: "用户管理",
          roles: ["PERMISSION_SYSTEM_USER"],
        },
      },
      {
        path: "role",
        component: () => import("/@/views/system/role.vue"),
        meta: {
          name: "角色管理",
          roles: ["PERMISSION_SYSTEM_ROLE"],
        },
      },
      {
        path: "permission",
        component: () => import("/@/views/system/permission.vue"),
        meta: {
          name: "权限管理",
          roles: ["PERMISSION_SYSTEM_PERMISSION"],
        },
      },
      {
        path: "org",
        component: () => import("/@/views/system/org.vue"),
        meta: {
          name: "组织机构",
          roles: ["PERMISSION_SYSTEM_ORG"],
        },
      },
      {
        path: "apartment",
        component: () => import("/@/views/system/apartment.vue"),
        meta: {
          name: "部门管理",
          roles: ["PERMISSION_SYSTEM_DEPT"],
        },
      },
      {
        path: "setting",
        component: () => import("/@/views/system/setting.vue"),
        meta: {
          name: "系统配置",
          roles: ["PERMISSION_SYSTEM_CONFIG"],
        },
      },
    ],
  },
];
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/login",
      component: () => import("/@/views/login.vue"),
      meta: {
        layout: "default",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("user");
  if (token && username) {
    //获取权限列表
    if (store.state.asyncRouters.length) {
      if (to.fullPath == "/login") {
        next("/");
      } else {
        next();
      }
    } else {
      http
        .get(
          `/systemserver/system/permission/getUserPermission/${encodeURI(
            username
          )}`
        )
        .then((res) => {
          if (res && res.data) {
            if (res.data.permissions.length > 0) {
              localStorage.setItem("maskObj", JSON.stringify(res.data.roles));
              store.commit(
                "filterRouter",
                res.data.permissions.map((item: { mask: string }) => item.mask)
              );
              next({
                path: to.fullPath,
                replace: true,
              });
            } else {
              store.commit("filterRouter", []);
              localStorage.setItem("token", "");
              localStorage.setItem("userId", "");
              localStorage.setItem("orgId", "");
              localStorage.setItem("token", "");
              ElMessage.error("该用户没有权限访问");
              router.push("/login");
              next();
            }
          }
        })
        .catch(() => {
          console.log("error");
        });
    }
  } else {
    to.path == "/login" ? next() : next({ path: "/login" });
  }
  // ...
  // 返回 false 以取消导航
});

router.afterEach((transition) => {
  NProgress.done();
});

export default router;
