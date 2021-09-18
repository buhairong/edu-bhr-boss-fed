<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  mounted () {
    this.initEditor()
  },

  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor as any)
      editor.config.onchange = (value: string) => {
        this.$emit('input', value)
      }
      editor.create()
      editor.txt.html(this.value)

      editor.config.customUploadImg = async function (resultFiles: any, insertImgFn: any) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法

        // 上传图片，返回结果，将图片插入到编辑器中
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        insertImgFn(data.data.name)
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
