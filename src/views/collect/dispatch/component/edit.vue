<template>
	<div class="collect-edit-dic-container">
		<el-dialog :title="(form.uuid ? 'Edit' : 'Add')+' Dispatch'" v-model="isShowDialog" width="769px" destroy-on-close>
			<el-form :model="form" ref="formRef" :rules="rules" size="default" label-width="90px" label-position="top">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Name" />
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="form.type" placeholder="Type" style="width: 100%;">
            <el-option label="HTTP" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="Way" prop="way">
          <el-select v-model="form.way" placeholder="Way" style="width: 100%;">
            <el-option label="Serial" :value="1" />
            <el-option label="Weight" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="Rules" prop="rules">
          <Editor v-model="form.rules" placeholder="Rules" style="width: 100%;" />
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">Cancel</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{form.uuid ? 'Edit' : 'Add'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import {ElMessage} from "element-plus";
import {addItem, editItem, getItem} from "/@/api/collect/dispatch";
import Editor from '/@/components/myCodeMirror/index.vue';
import commonFunction from '/@/utils/commonFunction';
interface RuleFormState {
  uuid: string;
  name: string;
  type: number;
  way: number;
  rules: string;
}
interface DicState {
	isShowDialog: boolean;
	form: RuleFormState;
  rules: {}
}

export default defineComponent({
	name: 'EditDispatchData',
  components:{
    Editor
  },
	setup(_, {emit}) {
    const { toJson, toYamlOrJson } = commonFunction();
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			form: {
        uuid: '',
        name: '',
        type: 1,
        way: 1,
        rules: '',
			},
      rules: {
        name: [{ required: true, message: "Name can not empty" }],
      }
		});
		const openDialog = (row: RuleFormState|null) => {
      resetForm();
      if (row) {
        getItem(row.uuid).then((res:any)=>{
          const data:RuleFormState = res.data.data;
          state.form = {
            uuid: data.uuid,
            name: data.name,
            type: data.type,
            way: data.way,
            rules: toYamlOrJson(data.rules),
          }

        });
      }
			state.isShowDialog = true;
		};
    const resetForm = ()=>{
      state.form = {
        uuid: '',
        name: '',
        type: 1,
        way: 1,
        rules: '',
      }
    };
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		const onCancel = () => {
			closeDialog();
		};
    const callback= (msg: string) => {
      ElMessage.success(msg);
      closeDialog();
      emit('dataList');
    };
		const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (!valid) return false;
        const formData = {
          uuid: state.form.uuid,
          name: state.form.name,
          type: state.form.type,
          way: state.form.way,
          rules: toJson(state.form.rules),
        }
        if(!state.form.uuid) return addItem(formData).then(() => callback('Add Sucess'));
        return editItem(formData).then(() => callback('Edit Sucess'));
      });
		};
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
      formRef,
			...toRefs(state),
		};
	},
});
</script>
