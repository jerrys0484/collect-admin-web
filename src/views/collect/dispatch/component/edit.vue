<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.uuid ? 'Edit' : 'Add')+' Dispatch'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="90px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="ruleForm.name" placeholder="Name" />
        </el-form-item>
        <el-form-item label="Rules" prop="rules">
          <el-input v-model="ruleForm.rules" type="textarea" placeholder="Rules" />
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
  props:{
    sysYesNoOptions:{
      type:Array,
      default:()=>[]
    }
  },
	setup(prop,{emit}) {
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			ruleForm: {
        uuid: '',
        name: '',
        rules: '',
			},
      rules: {
        name: [
          { required: true, message: "Name can not empty", trigger: "blur" }
        ],
      }
		});
		const openDialog = (row: RuleFormState|null) => {
      resetForm();
      if (row) {
        getItem(row.uuid).then((res:any)=>{
          const data:RuleFormState = res.data.data
          state.ruleForm = data
        })
        state.ruleForm = row;
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
		const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if(!state.ruleForm.uuid){
            addItem(state.ruleForm).then(()=>{
              ElMessage.success('Add Success');
              closeDialog();
              emit('dataList')
            })
          }else{
            editItem(state.ruleForm).then(()=>{
              ElMessage.success('Edit Sucess');
              closeDialog();
              emit('dataList')
            })
          }
        }
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
