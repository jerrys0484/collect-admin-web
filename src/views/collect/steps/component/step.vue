<template>
<div>
    <el-row :gutter="10">
        <el-col :xs="24" :md="12" :lg="9">
            <Editor v-model="httpResponse" :height="800" />
        </el-col>
        <el-col :xs="24" :md="12" :lg="6">
            <el-col>
                <Editor v-model="params" :height="300">
                    <template #bottom>
                        <el-button size="small" @click="onDebug(false)" v-if="!!httpResponse" :loading="sendLoading">Debug</el-button>
                        <el-button type="primary" size="small" :disabled="!params" @click="onDebug(true)" :loading="sendLoading">Send</el-button>
                    </template>
                </Editor>
            </el-col>
            <el-col style="margin-top: 12px;">
                <Editor v-model="response" :height="300">
                    <template #bottom>
                        <el-button size="small" @click="onSave(false)">Edit</el-button>
                    </template>
                </Editor>
            </el-col>
            <el-col style="margin-top: 12px;">
                <Editor v-model="request" :height="176" />
            </el-col>
        </el-col>
        <el-col :xs="24" :md="12" :lg="9">
            <Editor v-model="debugResponse" :height="800" />
        </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="Confirm" width="1000px" transition="dialog-bounce">
        <el-row :gutter="10">
            <el-col :xs="24" :md="12">
                <Editor v-model="request" :height="500" />
            </el-col>
            <el-col :xs="24" :md="12">
                <Editor v-model="response" :height="500" />
            </el-col>
        </el-row>
        <template #footer>
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="onSave(true)" :loading="saveLoading">Confirm</el-button>
        </template>
    </el-dialog>
</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import Editor from '/@/components/myCodeMirror/index.vue';
import { editItem, debugItems } from "/@/api/collect/steps";
import { ElMessage } from 'element-plus';
import commonFunction from '/@/utils/commonFunction';
interface RuleFormState {
  request: string;
  response: string;
  httpResponse: string;
  debugResponse: string;
  params: string;
  dialogVisible: boolean;
  saveLoading: boolean;
  sendLoading: boolean;
}

export default defineComponent({
    name: 'Step',
    components: { Editor },
    props: {
        form: Object,
    },
	setup(prop) {
        const { toJson, toYamlOrJson, isJson } = commonFunction();
        const formRef = ref<HTMLElement | null>(null);
        const params = toYamlOrJson(JSON.stringify({
            data: prop.form?.data ? JSON.parse(toJson(prop.form?.data)) : null,
            vars: prop.form?.vars ? JSON.parse(toJson(prop.form?.vars)) : null,
        }));
        const state = reactive<RuleFormState>({
            request: toYamlOrJson(prop.form?.request),
            response: toYamlOrJson(prop.form?.response),
            httpResponse: '',
            debugResponse: '',
            params: params,
            dialogVisible: false,
            saveLoading: false,
            sendLoading: false
        });
        const activeNames = ref(['1']);
        const onSubmit = () => {
            const formWrap = unref(formRef) as any;
            if (!formWrap) return;
            formWrap.validate((valid: boolean) => {
                if (!valid) return false;
            });
        };
        const onSave = (confirm: boolean) => {
            if (!confirm) {
                state.dialogVisible = true;
                return false;
            }
            if(!prop.form?.uuid) return false;
            state.saveLoading = true;
            return editItem({
                uuid: prop.form?.uuid,
                request: toJson(state.request),
                response: toJson(state.response),
            }).then(() => {
                state.dialogVisible = false;
                ElMessage({message: 'Save Success',type: 'success',placement: 'top'});
            }).finally(() => {
                state.saveLoading = false;
            });
        }
        const onDebug = (isSend: boolean) => {
            if(!prop.form?.uuid) return false;
            state.sendLoading = true;
            state.debugResponse = '';
            if(isSend) state.httpResponse = '';
            debugItems({
                uuid: prop.form?.uuid,
                httpResponse: isSend ? null : state.httpResponse,
                params: toJson(state.params),
            }).then((res:any) => {
                state.debugResponse = formatJson(res.data.debugResponse ? res.data.debugResponse : '{"error":"response is empty"}');
                if (isSend) {
                    const hr:any = isJson(res.data.httpResponse) ? JSON.parse(res.data.httpResponse) : {Body: res.data.httpResponse};
                    state.httpResponse = hr.Body;
                } 
            }).finally(() => {
                state.sendLoading = false;
            });
        }
        const formatJson = (jsonStr: string) => {
            try {return JSON.stringify(JSON.parse(jsonStr), null, 2);} catch (e) {return jsonStr;}
        }
        return {
            onSubmit,
            onSave,
            onDebug,
            activeNames,
            formRef,
            formatJson,
            ...toRefs(state),
        };
    },
});
</script>
