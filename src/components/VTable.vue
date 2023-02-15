<template>
  <div class="tableWrapper">
    <slot name="top" :query="Query" :onQuery="onSearch" />
    <el-form :label-width="labelWidth" size="small" class="query">
      <slot name="query" :query="Query" />
    </el-form>
    <div class="buttons">
      <el-button
        v-if="$slots.query"
        :loading="loading"
        type="primary"
        size="medium"
        @click="onSearch"
      >
        搜索
      </el-button>

      <el-button v-if="$slots.query" size="medium" @click="onReset">
        重置
      </el-button>
      <slot
        name="button"
        :query="Query"
        :selection="selection"
        :onFresh="onFresh"
      />
    </div>
    <el-table
      :ref="(dom) => (Ref = dom)"
      v-loading="loading"
      class="table"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.4)"
      :header-cell-style="{
        background: '#F1F4F9',
        color: '#333',
        'font-size': '14px',
        padding: '12px 0',
      }"
      :cell-style="{
        padding: '11px 0',
      }"
      v-bind="$attrs"
      :data="list"
      :style="{ flex: $attrs.height ? '' : 1, overflow: 'overlay' }"
      @selection-change="handleSelectionChange"
    >
      <slot :onQuery="onSearch" :query="query" />
    </el-table>
    <el-pagination
      v-if="pagination"
      v-model:current-page="currentPage"
      v-model:page-size="PageSize"
      class="pagination"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import qs from "qs";
import { Canceler } from "axios";
import {
  computed,
  defineComponent,
  onUnmounted,
  reactive,
  Ref,
  ref,
  toRefs,
} from "vue";
import http from "../config/http";
import { ElMessage } from "element-plus";
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    url: {
      type: String,
      default: "",
    },
    keyword: {
      type: String,
      default: "",
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    query: {
      type: Object,
      default: () => ({}),
    },
    method: {
      type: String,
      default: "post",
    },
    parse: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: String,
      default: "80px",
    },
  },
  emits: ["selection-change", "fetch-success", "delete-time"],
  setup(props, { emit }) {
    let _query = JSON.stringify(props.query);
    let list: Ref<any[]>;
    const loading = ref(false);
    const { url, data, keyword } = toRefs(props);
    let query = reactive(props.query);
    //分页
    const currentPage = ref(1);
    const pageSize = ref(
      Number(localStorage.getItem(props.url)) || props.pageSize
    );
    let total = ref(0);
    let cancels: Canceler[] = [];
    onUnmounted(() => {
      cancels.forEach((cancel) => cancel());
      cancels = [];
    });
    const Ref = ref();
    const fetch = (
      page: number,
      pageSize: number,
      query: Record<string, any>
    ) => {
      if (!url.value) return false;
      loading.value = true;
      const httpInstance = props.method == "get" ? http.get : http.post;
      let params = query;
      if (props.pagination) {
        params = {
          currentPage: Number(page),
          pageSize: Number(pageSize),
          ...query,
        };
      }
      httpInstance(
        url.value + (props.parse ? "?" + qs.stringify(params) : ""),
        params,
        { aborts: cancels }
      )
        .then((res) => {
          loading.value = false;

          if (res && res.data && keyword.value) {
            list.value = res.data[keyword.value];
            total.value = res.data[keyword.value].length;
            emit("fetch-success", list.value, Ref.value);
          } else if (res && res.data) {
            if (res.data) {
              list.value = res.data.list ? res.data.list : res.data;
              total.value = res.data.totalCount ?? res.data.total;
            } else {
              (list.value = [res.data]), (total.value = res.data ? 1 : 0);
            }
            emit("fetch-success", list.value, Ref.value, total.value);
          }
        })
        .catch((msg = "") => {
          loading.value = false;
          // ElMessage.error(msg);
        });
    };

    if (url.value) {
      list = ref([]);
      fetch(1, pageSize.value, query);
    } else {
      list = computed(() =>
        data.value
          .slice(
            pageSize.value * (currentPage.value - 1),
            pageSize.value * currentPage.value
          )
          .map((v) => v)
      ) as Ref;

      total = computed(() => data.value.length) as Ref;
    }
    const handleCurrentChange = (page: number) => {
      fetch(page, pageSize.value, query);
    };
    const handleSizeChange = (size: number) => {
      pageSize.value = size;
      localStorage.setItem(props.url, String(size));
      currentPage.value = 1;
      fetch(1, pageSize.value, query);
    };
    //多选 reserve-selection 配合 row-key缓存多选
    const selection = ref<any[]>([]);
    const handleSelectionChange = (val: Record<string, any>[]) => {
      selection.value = val;
      emit("selection-change", val);
    };
    return {
      fetch,
      loading,
      list,
      currentPage,
      PageSize: pageSize,
      total,
      handleCurrentChange,
      handleSizeChange,
      Query: query,
      onSearch() {
        currentPage.value = 1;
        fetch(1, pageSize.value, query);
      },
      onReset() {
        let temp = JSON.parse(_query);
        for (let i in query) {
          query[i] = temp[i];
        }
        currentPage.value = 1;
        emit("delete-time", []);
        fetch(1, pageSize.value, query);
      },
      onFresh() {
        fetch(currentPage.value, pageSize.value, query);
      },
      selection,
      handleSelectionChange,
      Ref,
    };
  },
});
</script>

<style lang="scss" scoped>
.tableWrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.query {
  display: flex;
  flex-wrap: wrap;
}

.table {
  width: 100%;
  border: 1px solid #e1e4eb;
  border-radius: 6px;
  margin-top: 10px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 24px;
  padding: 8px 0;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 -10px;
}
:deep(.buttons > *) {
  margin: 0 10px;
}
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
