<template>
  <div class="template-dic-container">
    <el-card shadow="hover">
      <div class="template-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-position="top">
          <el-form-item label="Name" prop="name">
            <el-input v-model="tableData.param.name" placeholder="Please enter name" size="default" />
          </el-form-item>
          <el-form-item label="Create Time" prop="dateRange">
            <el-date-picker
                v-model="tableData.param.dateRange"
                size="default"
                style="width: 240px"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="Start Date"
                end-placeholder="End Date"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Opreate">
            <el-button size="default" type="primary" @click="listData">
              <el-icon>
                <ele-Search />
              </el-icon>
              <span>Search</span>
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              <span>Add</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column label="Uuid" prop="uuid" width="290">
          <template #default="scope">
            <span @click="copyText(scope.row.uuid)">{{scope.row.uuid}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name" prop="name" />
        <el-table-column label="Create Time" prop="created" width="180" />
        <el-table-column label="Update Time" prop="updated" width="180" />
        <el-table-column label="Operate" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEdit(scope.row)">Edit</el-button>
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
import Edit from '/@/views/collect/template/component/edit.vue';
import {getList} from "/@/api/collect/template";
import dayjs from 'dayjs';
import commonFunction from '/@/utils/commonFunction';

interface TableDataRow {
  uuid: string;
  name: string,
  vars: string,
  data: string,
  createTime: number,
  updateTime: number,
  created: string,
  updated: string,
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
  name: 'templateList',
  components: { Edit },
  setup() {
    const { copyText } = commonFunction();
    const editRef = ref();
    const runRef = ref();
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
          name: '',
        },
      },
    });
    const listData=()=>{
      getList(state.tableData.param).then((res:any) => {
        const data = res.data.list;
        data.forEach((item:TableDataRow) => {
          item.created = dayjs.unix(item.createTime).format('YYYY-MM-DD HH:mm:ss');
          item.updated = item.updateTime ? dayjs.unix(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-';
        });
        state.tableData.data = data;
        state.tableData.total = res.data.total;
      });
    };
    const onOpenAdd = () => editRef.value.openDialog();
    const onOpenEdit = (row: TableDataRow) => editRef.value.openDialog(row);
    const onOpenRun = (row: TableDataRow) => runRef.value.openDialog(row);
    onMounted(() => listData());
    return {
      editRef,
      runRef,
      onOpenAdd,
      onOpenEdit,
      onOpenRun,
      listData,
      copyText,
      ...toRefs(state),
    };
  },
});
</script>
