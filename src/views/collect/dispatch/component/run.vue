<template>
  <el-drawer v-model="isShowDialog" title="Run" size="100%" destroy-on-close>
    <el-collapse expand-icon-position="right" style="padding: 0 15px;" v-model="activeNames">
        <el-collapse-item v-for="(value, key) in steps" :title="value.uuid" :name="value.uuid" :key="value.uuid">
            <Steps :uuid="value.uuid" :params="value.params" :index="key" @updateNextParams="updateNextParams" />
        </el-collapse-item>
    </el-collapse>
  </el-drawer>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import Steps from '/@/views/collect/dispatch/component/step.vue';
import {getItem} from "/@/api/collect/template";
import commonFunction from '/@/utils/commonFunction';
interface DistpatchState {
    uuid: string;
    name: string;
    type: string;
    rules: string;
    template: string;
}
interface AllState {
    isShowDialog: boolean;
    steps: Array<any>;
}
export default defineComponent({
    name: 'RunDispatchData',
    components: {Steps},
	setup() {
        const { toYamlOrJson, toJson } = commonFunction();
        const formRef = ref<HTMLElement | null>(null);
        const activeNames = ref(['']);
        const state = reactive<AllState>({
            isShowDialog: false,
            steps: [],
        });
        const openDialog = (row: DistpatchState) => {
            if (row.template) getItem(row.template).then((res:any) => {
                const data:any = res.data.data;
                const paramsTemp = toYamlOrJson(JSON.stringify({
                    data: data.data ? JSON.parse(data.data) : null,
                    vars: data.vars ? JSON.parse(data.vars) : null,
                }));
                if (row.rules) {
                    const rules:any = JSON.parse(row.rules);
                    const stepsTemp:any[] = rules.steps || [];
                    const active:string[] = [];
                    rules.params = paramsTemp;
                    stepsTemp.forEach(step => {
                        active.push(step.uuid);
                        step.params = paramsTemp;
                        state.steps.push(step);
                    });
                    activeNames.value = active;
                }
            });
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
            });
        };
        const updateNextParams = (str: string, index: number) => {
            if (state.steps.length <= index) return;
            const data = JSON.parse(str);
            const paramsTemp = JSON.parse(toJson(state.steps[index].params));
            for (let key in data) paramsTemp.data[key] = data[key];
            state.steps[index].params = toYamlOrJson(JSON.stringify(paramsTemp));
        }
        return {
            openDialog,
            closeDialog,
            onCancel,
            onSubmit,
            updateNextParams,
            activeNames,
            formRef,
            ...toRefs(state),
        };
    },
});
</script>