<template>
<div>
    <el-row :gutter="10">
        <el-col :xs="24" :md="12" :lg="9">
            <Editor v-model="httpResponse" :height="800" />
        </el-col>
        <el-col :xs="24" :md="12" :lg="6">
            <el-col>
                <Editor v-model="params" :height="390">
                    <template #bottom>
                        <el-button size="small" @click="onDebug(false)" v-if="!!httpResponse" :loading="sendLoading">Debug</el-button>
                        <el-button type="primary" size="small" :disabled="!params" @click="onDebug(true)" :loading="sendLoading">Send</el-button>
                    </template>
                </Editor>
            </el-col>
            <el-col style="margin-top: 20px;">
                <Editor v-model="config" :height="390">
                    <template #bottom>
                        <el-button size="small" @click="onSave(false)">Save</el-button>
                    </template>
                </Editor>
            </el-col>
        </el-col>
        <el-col :xs="24" :md="12" :lg="9">
            <Editor v-model="debugResponse" :height="800" />
        </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="Confirm" width="60%" transition="dialog-bounce">
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
import { reactive, toRefs, defineComponent,ref, unref, watch } from 'vue';
import Editor from '/@/components/myCodeMirror/index.vue';
import { editItem, debugItems } from "/@/api/collect/steps";
import { ElMessage } from 'element-plus';
import commonFunction from '/@/utils/commonFunction';
interface RuleFormState {
  uuid: string;
  name: string;
  type: string;
  request: string;
  response: string;
  httpResponse: string;
  debugResponse: string;
  params: string;
  dialogVisible: boolean;
  saveLoading: boolean;
  sendLoading: boolean;
  config: string;
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
        const config = toYamlOrJson(JSON.stringify({
            request: JSON.parse(toJson(prop.form?.request)),
            response: JSON.parse(toJson(prop.form?.response)),
        }));
        const state = reactive<RuleFormState>({
            uuid: '',
            name: '',
            type: '',
            request: '',
            response: '',
            httpResponse: '',
            debugResponse: '',
            params: toYamlOrJson('{"data":{"key":"value"},"vars":{"key1":"value1","key2":"value2","key3":"value3"}}'),
            dialogVisible: false,
            saveLoading: false,
            sendLoading: false,
            config: config,
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
                const rr = JSON.parse(toJson(state.config));
                state.request = toYamlOrJson(JSON.stringify(rr.request));
                state.response = toYamlOrJson(JSON.stringify(rr.response));
                return false;
            }
            if(!prop.form?.uuid) return false;
            state.saveLoading = true;
            return editItem({
                uuid: prop.form?.uuid,
                name: prop.form?.name,
                type: prop.form?.type,
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
        watch(() => state.request, (newVal) => {
            if (!newVal) return;
            const rr = JSON.parse(toJson(state.config));
            rr.request = JSON.parse(toJson(newVal));
            state.config = toYamlOrJson(JSON.stringify(rr));
        });
        watch(() => state.response, (newVal) => {
            if (!newVal) return;
            const rr = JSON.parse(toJson(state.config));
            rr.response = JSON.parse(toJson(newVal));
            state.config = toYamlOrJson(JSON.stringify(rr));
        });
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
