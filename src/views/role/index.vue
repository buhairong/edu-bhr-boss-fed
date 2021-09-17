<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="addRole">添加角色</el-button>
      </div>
      <el-table
        :data="roles"
        style="width: 100%">
        <el-table-column
          align="center"
          label="编号"
          type="index">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <div>
              <el-button size="mini"
                type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    id: scope.row.id
                  }
                })"
              >分配菜单</el-button>
              <el-button size="mini" type="text">分配资源</el-button>
            </div>
            <div>
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="idEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoles, createOrUpdateRole, deleteRole } from '@/services/role'

export default Vue.extend({
  name: 'RoleIndex',

  data () {
    return {
      roles: [],
      filter: {
        current: 1,
        size: 100
      },
      form: {
        id: null,
        code: '',
        name: '',
        description: ''
      },
      dialogVisible: false,
      idEdit: false
    }
  },

  created () {
    this.getRoles()
  },

  methods: {
    async getRoles () {
      const { data } = await getRoles(this.filter)
      if (data.code === '000000') {
        this.roles = data.data.records
      }
    },

    async onSubmit () {
      const { data } = await createOrUpdateRole(this.form)
      if (data.code === '000000') {
        this.$message.success('添加成功')
        this.getRoles()
        this.dialogVisible = false
      }
    },

    addRole () {
      this.idEdit = false
      this.form.id = null
      this.form.code = ''
      this.form.name = ''
      this.form.description = ''
      this.dialogVisible = true
    },

    handleEdit (row: any) {
      this.idEdit = true
      this.form = row
      this.dialogVisible = true
    },

    handleDelete (row: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => {
          const { data } = await deleteRole(row.id)
          if (data.code === '000000') {
            this.$message.success('删除成功！')
            this.getRoles()
          }
        })
    }
  }
})
</script>

<style lang="scss" scoped></style>
