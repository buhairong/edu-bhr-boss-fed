<template>
  <div>
    <el-tree
      :data="sections"
      :props="defaultProps"
      draggable
      :allow-drop="handleAllowDrop"
      @node-drop="handleSort"
    >
      <div class="inner" slot-scope="{ node, data}">
        <span>{{ node.label }}</span>
        <span class="actions" v-if="data.sectionName">
          <el-button>编辑</el-button>
          <el-button>添加课时</el-button>
          <el-button>状态</el-button>
        </span>
        <span class="actions" v-else>
          <el-button>编辑</el-button>
          <el-button type="success" @click="$router.push({
            name: 'course-video',
            params: {
              id
            },
            query: {
              sectionId: node.parent.id,
              lessonId: data.id
            }
          })">上传视频</el-button>
          <el-button>状态</el-button>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course'

export default Vue.extend({
  name: 'CourseSection',

  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },

  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },

  created () {
    this.loadSections()
  },

  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.id)
      this.sections = data.data
    },

    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      console.log('draggingNode', draggingNode)
      // draggingNode 拖动的节点
      // dropNode 放置的目标节点
      // type: 'prev'、'inner' 和 'next',分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },

    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            // 阶段
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          } else {
            // 课时
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (error) {
        console.log(error)
        this.$message.error('排序失败')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.inner {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}
</style>
