<template>
<div>
    <el-row :gutter="10">
        <el-col :xs="24" :md="12" :lg="6">
            <Editor v-model="httpResponse" :height="800">
                <span v-show="!!httpResponse">
                    <el-button size="small" @click="httpResponse = formatJson(httpResponse)">Format</el-button>
                    <el-button size="small">Copy</el-button>
                </span>
            </Editor>
        </el-col>
        <el-col :xs="24" :md="12" :lg="6">
            <Editor v-model="response" :height="800">
                <el-button size="small" @click="onDebug(false)">Debug</el-button>
            </Editor>
        </el-col>
        <el-col :xs="24" :md="12" :lg="6">
            <Editor v-model="debugResponse" :height="800">
                <el-button size="small" v-show="!!debugResponse">Copy</el-button>
            </Editor>
        </el-col>
        <el-col :xs="24" :md="12" :lg="6">
            <el-col>
                <Editor v-model="params" :height="390">
                    <el-button size="small" @click="dialogVisible = true">Save</el-button>
                    <el-button type="primary" size="small" :disabled="!params || !response || !request" @click="onDebug(true)" :loading="sendLoading">Send</el-button>
                </Editor>
            </el-col>
            <el-col style="margin-top: 20px;">
                <Editor v-model="request" :height="390"></Editor>
            </el-col>
        </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="Confirm Save" width="60%" transition="dialog-bounce">
        <el-row :gutter="10">
            <el-col :xs="24" :md="12">
                <Editor v-model="request" :height="500"></Editor>
            </el-col>
            <el-col :xs="24" :md="12">
                <Editor v-model="response" :height="500"></Editor>
            </el-col>
        </el-row>
        <template #footer>
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="onSave" :loading="saveLoading">Confirm</el-button>
        </template>
    </el-dialog>
</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import Editor from '/@/components/myCodeMirror/index.vue';
import { editItem, debugItems } from "/@/api/collect/steps";
import { ElMessage } from 'element-plus'
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
}

export default defineComponent({
    name: 'Step',
    components: { Editor },
    props: {
        form: Object,
    },
	setup(prop) {
        const formRef = ref<HTMLElement | null>(null);
        const state = reactive<RuleFormState>({
            uuid: '',
            name: '',
            type: '',
            request: prop.form?.request || '',
            response: prop.form?.response || '',
            httpResponse: '',
            debugResponse: '',
            params: '',
            dialogVisible: false,
            saveLoading: false,
            sendLoading: false,
        });
        const activeNames = ref(['1']);
        const onSubmit = () => {
            const formWrap = unref(formRef) as any;
            if (!formWrap) return;
            formWrap.validate((valid: boolean) => {
                if (!valid) return false;
            });
        };
        const onSave = () => {
            if(!prop.form?.uuid) return false;
            state.saveLoading = true;
            return editItem({
                uuid: prop.form?.uuid,
                name: prop.form?.name,
                type: prop.form?.type,
                request: state.request,
                response: state.response,
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
                params: state.params,
            }).then((res:any) => {
                state.debugResponse = formatJson(res.data.debugResponse);
                if (isSend) {
                    const hr:any = JSON.parse(res.data.httpResponse);
                    state.httpResponse = hr.Body;
                } 
            }).finally(() => {
                state.sendLoading = false;
            });
        }
        const formatJson = (jsonStr: string) => {
            try {
                const obj = JSON.parse(jsonStr);
                return JSON.stringify(obj, null, 2);
            } catch (e) {
                ElMessage({message: 'Invalid JSON format',type: 'error',placement: 'top'});
                return jsonStr;
            }
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
