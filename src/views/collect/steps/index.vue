<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="Name" prop="name">
            <el-input
                v-model="tableData.param.name"
                placeholder="Please enter name"
                clearable
                size="default"
            />
          </el-form-item>
          <el-form-item label="创建时间" prop="dateRange">
            <el-date-picker
                v-model="tableData.param.dateRange"
                size="default"
                style="width: 240px"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="listData">
              <el-icon>
                <ele-Search />
              </el-icon>
              Search
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              Add
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column label="Uuid" prop="uuid" width="280" />
        <el-table-column label="Name" prop="name" />
        <el-table-column label="Type" prop="type" width="300" />
        <el-table-column label="Create Time" prop="createTime" width="180" />
        <el-table-column label="Update Time" prop="updateTime" width="180" />
        <el-table-column label="Operate" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="listData"
      />
    </el-card>
    <Edit ref="editRef" @dataList="listData" />
  </div>
</template>

<script lang="ts">
import {toRefs,reactive,onMounted,ref,defineComponent} from 'vue';
import Edit from '/@/views/collect/steps/component/edit.vue';
import {getList} from "/@/api/collect/steps";

interface TableDataRow {
  uuid: string;
  name: string,
  type: string,
  request: string,
  response: string,
  createTime: number,
  updateTime: number,
}
interface TableDataState {
  uuids: string[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      name: string;
      dateRange: string[];
    };
  };
}

export default defineComponent({
  name: 'stepsList',
  components: { Edit },
  setup() {
    const editRef = ref();
    const state = reactive<TableDataState>({
      uuids:[],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          dateRange: [],
          pageNum: 1,
          pageSize: 10,
          name:'',
        },
      },
    });
    const listData=()=>{
      getList(state.tableData.param).then((res:any)=>{
        state.tableData.data = res.data.list;
        state.tableData.total = res.data.total;
      });
    };
    const onOpenAdd = () => {
      editRef.value.openDialog();
    };
    const onOpenEdit = (row: TableDataRow) => {
      editRef.value.openDialog(row);
    };
    onMounted(() => {
      listData();
    });
    return {
      editRef,
      onOpenAdd,
      onOpenEdit,
      listData,
      ...toRefs(state),
    };
  },
});
</script>
