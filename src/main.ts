import { createApp } from "vue";
import App from "./App.vue";
import "./style/iconfont/iconfont.css";
import "./style/element-variables.scss";
// import "element-plus/packages/theme-chalk/src/base.scss";
import {
  locale,
  ElButton,
  ElButtonGroup,
  ElPagination,
  ElDivider,
  ElForm,
  ElFormItem,
  ElInput,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTabPane,
  ElLoading,
  ElTooltip,
  ElMenu,
  ElSubmenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElDatePicker,
  ElUpload,
  ElDialog,
  ElStep,
  ElSteps,
  ElSelect,
  ElOption,
  ElOptionGroup,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
  ElCollapse,
  ElCollapseItem,
  ElCheckboxGroup,
  ElCheckbox,
  ElCascader,
  ElTree,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSwitch,
} from "element-plus";
import "dayjs/locale/zh-cn";
import lang from "element-plus/lib/locale/lang/zh-cn";
import router from "./router";
import store from "./store";
const app = createApp(App);
app.config.globalProperties.$ELEMENT = { size: "small" };
locale(lang);
app.use(router);
app.use(store);
app.use(ElDivider);
app.use(ElLoading);
app.use(ElButton);
app.use(ElButtonGroup);
app.use(ElForm);
app.use(ElFormItem);
app.use(ElInput);
app.use(ElTable);
app.use(ElTableColumn);
app.use(ElTabs);
app.use(ElTabPane);
app.use(ElPagination);
app.use(ElTooltip);
app.use(ElMenu);
app.use(ElSubmenu);
app.use(ElMenuItemGroup);
app.use(ElMenuItem);
app.use(ElDatePicker);
app.use(ElUpload);
app.use(ElDialog);
app.use(ElStep);
app.use(ElSteps);
app.use(ElSelect);
app.use(ElOption);
app.use(ElOptionGroup);
app.use(ElRadio);
app.use(ElRadioGroup);
app.use(ElRadioButton);
app.use(ElCollapse);
app.use(ElCollapseItem);
app.use(ElCheckboxGroup);
app.use(ElCheckbox);
app.use(ElCascader);
app.use(ElTree);
app.use(ElDropdown);
app.use(ElDropdownMenu);
app.use(ElDropdownItem);
app.use(ElSwitch);
app.mount("#app");
