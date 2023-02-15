<template>
  <el-tabs class="tabs">
    <el-tab-pane label="海内外知名高校博士类">
      <V-Table
        url="/talentserver/talent/getExpertReview"
        method="get"
        :query="{
          type: 'a1',
        }"
      >
        <!-- <template #query="{ query }">
          <el-form-item label="姓名">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
        </template> -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            <span>
              {{
                row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="工作单位" prop="companyName"></el-table-column>
        <el-table-column
          label="专业技术职务"
          prop="techPosition"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职务"
          prop="post"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否完成评选"
          prop="grade"
          align="center"
        ></el-table-column>
        <el-table-column label="复合评选意见" prop="assigned"></el-table-column>
        <el-table-column label="操作">
          <!-- <template #default="{ row }">
            <el-button type="text" @click="onVerifyShow(row)">认定</el-button>
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template> -->
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="获得省级以上荣誉优秀毕业生类" :lazy="true">
      <V-Table
        url="/talentserver/talent/getExpertReview"
        method="get"
        :query="{
          type: 'a2',
        }"
      >
        <!-- <template #query="{ query }">
          <el-form-item label="姓名">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
        </template> -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            <span>
              {{
                row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="工作单位" prop="companyName"></el-table-column>
        <el-table-column
          label="专业技术职务"
          prop="techPosition"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职务"
          prop="post"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否完成评选"
          prop="grade"
          align="center"
        ></el-table-column>
        <el-table-column label="复合评选意见" prop="assigned"></el-table-column>
        <el-table-column label="操作">
          <!-- <template #default="{ row }">
            <el-button type="text" @click="onVerifyShow(row)">认定</el-button>
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template> -->
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="入选青年科技创新人才榜单类" :lazy="true">
      <V-Table
        url="/talentserver/talent/getExpertReview"
        method="get"
        :query="{
          type: 'b1',
        }"
      >
        <!-- <template #query="{ query }">
          <el-form-item label="姓名">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
        </template> -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            <span>
              {{
                row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="工作单位" prop="companyName"></el-table-column>
        <el-table-column
          label="专业技术职务"
          prop="techPosition"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职务"
          prop="post"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否完成评选"
          prop="grade"
          align="center"
        ></el-table-column>
        <el-table-column label="复合评选意见" prop="assigned"></el-table-column>
        <el-table-column label="操作">
          <!-- <template #default="{ row }">
            <el-button type="text" @click="onVerifyShow(row)">认定</el-button>
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template> -->
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="获得市级以上创业赛事大奖类" :lazy="true">
      <V-Table
        url="/talentserver/talent/getExpertReview"
        method="get"
        :query="{
          type: 'b2',
        }"
      >
        <!-- <template #query="{ query }">
          <el-form-item label="姓名">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
        </template> -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            <span>
              {{
                row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="工作单位" prop="companyName"></el-table-column>
        <el-table-column
          label="专业技术职务"
          prop="techPosition"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职务"
          prop="post"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否完成评选"
          prop="grade"
          align="center"
        ></el-table-column>
        <el-table-column label="复合评选意见" prop="assigned"></el-table-column>
        <el-table-column label="操作">
          <!-- <template #default="{ row }">
            <el-button type="text" @click="onVerifyShow(row)">认定</el-button>
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template> -->
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="创投机构举荐类" :lazy="true">
      <V-Table
        url="/talentserver/talent/getExpertReview"
        method="get"
        :query="{
          type: 'b3',
        }"
      >
        <!-- <template #query="{ query }">
          <el-form-item label="姓名">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
        </template> -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            <span>
              {{
                row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="工作单位" prop="companyName"></el-table-column>
        <el-table-column
          label="专业技术职务"
          prop="techPosition"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职务"
          prop="post"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否完成评选"
          prop="grade"
          align="center"
        ></el-table-column>
        <el-table-column label="复合评选意见" prop="assigned"></el-table-column>
        <el-table-column label="操作">
          <!-- <template #default="{ row }">
            <el-button type="text" @click="onVerifyShow(row)">认定</el-button>
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template> -->
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="用人单位举荐类" :lazy="true">
      <V-Table
        url="/talentserver/talent/getExpertReview"
        method="get"
        :query="{
          type: 'c',
        }"
      >
        <!-- <template #query="{ query }">
          <el-form-item label="姓名">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
        </template> -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            <span>
              {{
                row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="工作单位" prop="companyName"></el-table-column>
        <el-table-column
          label="专业技术职务"
          prop="techPosition"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职务"
          prop="post"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否完成评选"
          prop="grade"
          align="center"
        ></el-table-column>
        <el-table-column label="复合评选意见" prop="assigned"></el-table-column>
        <el-table-column label="操作">
          <!-- <template #default="{ row }">
            <el-button type="text" @click="onVerifyShow(row)">认定</el-button>
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template> -->
        </el-table-column>
      </V-Table>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VTable from "/@/components/VTable.vue";
export default defineComponent({
  components: {
    VTable,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.el-tabs__content) {
    flex: 1;
    .el-tab-pane {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}

.row {
  display: flex;
  margin: 0 -15px;
  > * {
    flex: 1;
    padding: 0 15px;
  }
  span {
    line-height: 36px;
  }
}
.exportWord {
  position: absolute;
  top: 60px;
  right: 20px;
}
.iconRight {
  display: flex;
  justify-content: flex-end;
}
</style>
