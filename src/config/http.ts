import axios, { Canceler } from "axios";
import { ElMessageBox, ElLoading, ElMessage } from "element-plus";
import { ILoadingInstance } from "element-plus/lib/el-loading/src/loading.type";
import emitter from "../config/bus";
// import mitt from 'mitt'
// const emitter = mitt()
//AxiosResponse
const instance = axios.create({
  baseURL: "/gateway",
  timeout: 120000,
  // headers: {'X-Custom-Header': 'foobar'}
});
// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    config.headers.Authorization = localStorage.getItem("token");
    config.headers.userId = localStorage.getItem("userId");
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

interface Res {
  [x: string]: any;
  code: number;
  data: any;
  info?: string;
}
// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { status } = response;
    const { code, data, info, msg } = response.data as Res;
    const err: string = info || msg;
    if (isNaN(code)) {
      return Promise.resolve(response.data);
    }
    if (status == 200) {
      if (code == 0 || code == 200) {
        return response.data;
      } else {
        if (code == 401) {
          setTimeout(() => {
            emitter.emit("tokenInvalid");
          }, 1000);
        }

        return Promise.reject(err);
      }
    } else if (status == 401) {
      ElMessageBox.confirm("登录失效，前往登录页面", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        localStorage.setItem("token", "");
      });
      return Promise.reject("登录失效");
    } else if (status == 500) {
      ElMessage.error("系统异常");
      return Promise.reject(err);
    } else if (status == 405) {
      ElMessage.error("该用户无权访问页面");

      return Promise.reject(err);
    } else if (code == 1001) {
      ElMessage.error("该用户无权访问页面");

      return Promise.reject(err);
    } else {
      return Promise.reject(err);
    }
  },
  (error: Error) => {
    if (error instanceof axios.Cancel) {
      console.warn("请求已取消");
      return new Promise(() => {
        console.log("");
      });
    }
    // 对响应错误做点什么
    return Promise.reject(error.message);
  }
);
interface Options {
  loading?: boolean; //是否loading
  message?: boolean; //是否提示
  aborts?: Canceler[]; //取消请求
  errMessage?: boolean; // 错误提示
  [x: string]: any;
}
const request = (promise: Promise<Res>, options?: Options) => {
  let $loading: ILoadingInstance;
  if (options?.loading) {
    $loading = ElLoading.service({
      lock: true,
      text: "加载中",
    });
  }
  return promise
    .then((res) => {
      const { data, info, code, msg } = res;
      if (options?.message && code == 200) {
        ElMessage.success(info || msg || "操作成功");
      }
      return Promise.resolve(res);
    })
    .catch((msg = "") => {
      if (options) {
        const { errMessage = true } = options;
        errMessage && ElMessage.error(msg);
      } else {
        ElMessage.error(msg);
      }
      return Promise.reject(msg);
    })
    .finally(() => {
      if ($loading) $loading.close();
    });
};
//取消请求
const createCancel = (aborts: Canceler[] | undefined) => {
  if (aborts?.length) {
    aborts?.forEach((cancel) => cancel());
    aborts.length = 0;
  }
  const CancelToken = axios.CancelToken;
  if (Array.isArray(aborts)) {
    return {
      cancelToken: new CancelToken((cancel) => {
        // executor 函数接收一个 cancel 函数作为参数
        aborts.push(cancel);
      }),
    };
  } else {
    return {};
  }
};
export default {
  get(
    url: string,
    data?: Record<string, any>,
    options?: Options
  ): Promise<Res> {
    const cancels = createCancel(options?.aborts);
    Object.assign(cancels, options);
    return request(
      instance.get(url, { params: data || {}, ...cancels }),
      options
    );
  },
  post(
    url: string,
    data?: Record<string, any>,
    options?: Options
  ): Promise<Res> {
    const cancels = createCancel(options?.aborts);
    Object.assign(cancels, options);
    return request(instance.post(url, data, cancels), options);
  },
};
