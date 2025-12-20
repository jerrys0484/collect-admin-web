<template>
	<div class="collect-edit-dic-container">
		<el-dialog :title="(form.uuid ? 'Edit' : 'Add')+' Steps'" v-model="isShowDialog" width="600px" destroy-on-close>
			<el-form :model="form" ref="formRef" size="default" label-width="90px" label-position="top">
        <el-row :gutter="10">
          <el-col :xs="24" :md="12">
             <el-form-item label="Name" prop="name">
              <el-input v-model="form.name" placeholder="Name" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
             <el-form-item label="Type" prop="type">
              <el-input v-model="form.type" placeholder="Type" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Template" prop="template">
          <el-input v-model="form.template" placeholder="Template" />
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">Cancel</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ form.uuid ? 'Edit' : 'Add' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import {ElMessage} from "element-plus";
import {addItem, editItem, getItem} from "/@/api/collect/steps";
// import commonFunction from '/@/utils/commonFunction';
interface RuleFormState {
  uuid: string;
  name: string;
  type: string;
  template: string;
}
interface AllState {
	isShowDialog: boolean;
	form: RuleFormState;
}

export default defineComponent({
	name: 'EditDispatchData',
	setup(prop, {emit}) {
    // const { toJson, toYamlOrJson } = commonFunction();
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<AllState>({
			isShowDialog: false,
			form: reactive<RuleFormState>({
        uuid: '',
        name: '',
        type: 'http',
        template: '',
      })
		});
		const openDialog = (row: RuleFormState|null) => {
      resetForm();
      if (row) {
        getItem(row.uuid).then((res:any)=>{
          const data:RuleFormState = res.data.data
          state.form = {
            uuid: data.uuid,
            name: data.name,
            type: data.type,
            template: data.template,
          }
        });
      }
			state.isShowDialog = true;
		};
    const resetForm = () => {
      state.form = {
        uuid: '',
        name: '',
        type: 'http',
        template: '',
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
          template: state.form.template,
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
