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
    <span style="position: absolute; right: 12px; bottom: 12px;">
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, shallowRef, watch} from 'vue';
import { Codemirror } from 'vue-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from '@codemirror/theme-one-dark';
import { Edit } from '@element-plus/icons-vue';

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
    const extensions = [yaml(), javascript(), oneDark, EditorView.lineWrapping];
    const view = shallowRef();
    const handleReady = (payload:any) => {
      code.value = props.modelValue;
      view.value = payload.view;
    }
    const editHeight = computed(() => props.height);
    watch(code, (newValue) => emit('update:modelValue', newValue));
    watch(() => props.modelValue, (newValue) => code.value = newValue);
    return {
      code,
      extensions,
      handleReady,
      editHeight,
      Edit,
    }
  }
})
</script>

<style>
.code-button>i {margin-right: 0 !important;}
</style>