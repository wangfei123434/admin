import { RouteRecordRaw } from "vue-router";
import { createStore } from "vuex";
import router, { asyncRouters } from "./router";
export default createStore({
  state() {
    return {
      asyncRouters: [],
      psw: "",
      baseURL: "http://58.49.165.170:8084/",
    };
  },
  mutations: {
    SET_ROUTERs(state: Record<string, any>, value) {
      state.asyncRouters = value;
    },
    filterRouter(state: Record<string, any>, permissions: string[]) {
      if (state.asyncRouters.length) return false;
      const Filter = (routers: RouteRecordRaw[] | undefined) => {
        return routers?.filter((parentRoute) => {
          const roles = parentRoute.meta?.roles as string[];
          const hasPermisson = roles?.every((role) =>
            permissions.includes(role)
          );
          if (hasPermisson !== false) {
            parentRoute.children = Filter(parentRoute.children);
            return true;
          }
          return false;
        });
      };
      const filterRouters: RouteRecordRaw[] | undefined = Filter(asyncRouters);
      if (filterRouters) {
        filterRouters.forEach((Router) => {
          router.addRoute(Router);
        });
      }
      state.asyncRouters = filterRouters;
      return true;
    },
    SET_PSW(state: Record<string, any>, value) {
      state.psw = value;
    },
  },
  actions: {},
});
