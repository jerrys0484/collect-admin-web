<template>
  <el-drawer v-model="isShowDialog" title="Run" size="100%">
    <el-collapse expand-icon-position="right" style="padding: 0 15px;" v-model="activeNames">
        <el-collapse-item :title="ruleForm.uuid + ' ('+ ruleForm.name +')'" name="1">
            <Steps :form="ruleForm" />
        </el-collapse-item>
    </el-collapse>
  </el-drawer>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import Steps from '/@/views/collect/steps/component/step.vue';
interface RuleFormState {
    uuid: string;
    name: string;
    type: string;
    request: string;
    response: string;
}
interface DicState {
    isShowDialog: boolean;
    ruleForm: RuleFormState;
}

export default defineComponent({
    name: 'RunDispatchData',
    components: {Steps},
	setup() {
        const formRef = ref<HTMLElement | null>(null);
        const state = reactive<DicState>({
            isShowDialog: false,
            ruleForm: {
                uuid: '',
                name: '',
                type: '',
                request: '',
                response: '',
            }
        });
        const openDialog = (row: RuleFormState) => {
            state.ruleForm = row;
            state.isShowDialog = true;
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
                if (!valid) return false;
                // if(!state.ruleForm.uuid) return addItem(state.ruleForm).then(() => callback('Add Sucess'));
                // return editItem(state.ruleForm).then(() => callback('Edit Sucess'));
            });
        };
        const activeNames = ref(['1']);
        return {
            openDialog,
            closeDialog,
            onCancel,
            onSubmit,
            activeNames,
            formRef,
            ...toRefs(state),
        };
    },
});
</script>