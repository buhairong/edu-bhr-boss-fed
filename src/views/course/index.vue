<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          @click="$router.push({
            name: 'course-create'
          })"
        >新建课程</el-button>
      </div>
      <el-table
        :data="courses"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="id"
          label="ID"
          width="80"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="courseName"
          label="课程名称"
          min-width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
          <el-button
            size="mini"
            @click="$router.push({
              name: 'course-edit',
              params: {
                id: scope.row.id
              }
            })">编辑</el-button>
          <el-button
            size="mini"
            @click="$router.push({
              name: 'course-section',
              params: {
                id: scope.row.id
              }
            })"
          >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="isLoading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.current"
        :page-sizes="[5, 10, 20]"
        :page-size="filter.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getQueryCourses, changeState } from '@/services/course'

export default Vue.extend({
  name: 'CourseIndex',
  data () {
    return {
      courses: [],
      filter: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      isLoading: false
    }
  },

  created () {
    this.getCourses()
  },

  methods: {
    async getCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filter)
      if (data.code === '000000') {
        this.courses = data.data.records
        this.total = data.data.total
      }
      this.isLoading = false
    },

    async onStatusChange (course: any) {
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
        this.getCourses()
      }
    },

    handleSizeChange (val: number) {
      this.filter.pageSize = val
      this.filter.currentPage = 1
      this.getCourses()
    },

    handleCurrentChange (val: number) {
      this.filter.currentPage = val
      this.getCourses()
    }
  }
})
</script>

<style lang="scss" scoped></style>
