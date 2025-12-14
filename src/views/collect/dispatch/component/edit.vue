<template>
	<div class="collect-edit-dic-container">
		<el-dialog :title="(ruleForm.uuid ? 'Edit' : 'Add')+' Dispatch'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="90px" label-position="top">
        <el-form-item label="Name" prop="name">
          <el-input v-model="ruleForm.name" placeholder="Name" />
        </el-form-item>
        <el-form-item label="Rules" prop="rules">
          <Editor v-model="ruleForm.rules" placeholder="Rules" style="width: 100%;" />
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">Cancel</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ruleForm.uuid ? 'Edit' : 'Add'}}</el-button>
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
interface RuleFormState {
  uuid: string;
  name: string;
  rules: string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
  rules: {}
}

export default defineComponent({
	name: 'EditDispatchData',
  components:{
    Editor
  },
	setup(_, {emit}) {
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			ruleForm: {
        uuid: '',
        name: '',
        rules: '',
			},
      rules: {
        name: [{ required: true, message: "Name can not empty", trigger: "blur" }],
      }
		});
		const openDialog = (row: RuleFormState|null) => {
      resetForm();
      if (row) {
        getItem(row.uuid).then((res:any)=>{
          const data:RuleFormState = res.data.data;
          state.ruleForm = data;
        });
      }
			state.isShowDialog = true;
		};
    const resetForm = ()=>{
      state.ruleForm = {
        uuid: '',
        name: '',
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
        if(!state.ruleForm.uuid) return addItem(state.ruleForm).then(() => callback('Add Sucess'));
        return editItem(state.ruleForm).then(() => callback('Edit Sucess'));
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
