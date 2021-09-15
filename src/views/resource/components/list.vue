<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" class="demo-form-inline">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="请选择资源分类" clearable>
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="isLoading" type="primary" @click="onSubmit">查询</el-button>
            <el-button :disabled="isLoading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="isLoading"
        :data="resources"
        style="width: 100%">
        <el-table-column
          label="编号"
          type="index">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="isLoading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, getResourceCategories } from '@/services/resource'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      form: {
        name: '',
        url: '',
        categoryId: null,
        current: 1,
        size: 10
      },
      resources: [],
      total: 0,
      categories: [],
      isLoading: false
    }
  },

  created () {
    this.getResourcePages()
    this.getResourceCategories()
  },

  methods: {
    async getResourcePages () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.total = data.data.total
      }
      this.isLoading = false
    },

    async getResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.categories = data.data
      }
    },

    onSubmit () {
      this.form.current = 1
      this.getResourcePages()
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.getResourcePages()
    },

    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1
      this.getResourcePages()
    },

    handleCurrentChange (val: number) {
      this.form.current = val
      this.getResourcePages()
    }
  }
})
</script>

<style lang="scss" scoped></style>
