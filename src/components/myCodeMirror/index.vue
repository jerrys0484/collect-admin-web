<template>
  <div style="position: relative;">
    <codemirror
      v-model="code"
      placeholder="config here..."
      :style="{ height: editHeight+'px', width: '100%' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
    />
    <span style="position: absolute; right: 12px; top: 12px;">
      <el-button size="small" class="code-button" v-if="!!code" :icon="CopyDocument" circle @click="copyText(code)"></el-button>
      <el-button size="small" class="code-button" @click="edmitModelValue(toYamlOrJson(code))" v-if="!!code" :icon="Switch" circle></el-button>
      <el-button size="small" class="code-button" @click="edmitModelValue(getFormatString(code))" v-if="!!code" :icon="Document" circle></el-button>
    </span>
    <span style="position: absolute; right: 12px; bottom: 12px;">
      <slot name="bottom"></slot>
    </span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, shallowRef, watch} from 'vue';
import { Codemirror } from 'vue-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Edit, CopyDocument, Switch, Document } from '@element-plus/icons-vue';
import commonFunction from '/@/utils/commonFunction';

export default defineComponent({
  name:"myCodeMirror",
  components: {
    Codemirror
  },
  props: {
    modelValue: {
      type:String,
      default: ''
    },
    height: {
      type:Number,
      default: 300
    }
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const code = ref('');
    const extensions = [javascript(), oneDark, EditorView.lineWrapping];
    const view = shallowRef();
    const { copyText, toYamlOrJson, getFormatString } = commonFunction();
    const handleReady = (payload:any) => {
      code.value = props.modelValue;
      view.value = payload.view;
    }
    const editHeight = computed(() => props.height);
    const edmitModelValue = (str: string) => emit('update:modelValue', str);
    watch(code, (newValue) => emit('update:modelValue', newValue));
    watch(() => props.modelValue, (newValue) => code.value = newValue);
    return {
      code,
      extensions,
      handleReady,
      editHeight,
      toYamlOrJson,
      getFormatString,
      copyText,
      edmitModelValue,
      Edit,
      CopyDocument,
      Switch,
      Document,
    }
  }
})
</script>

<style>
.code-button>i {margin-right: 0 !important;}
</style>