<template>
  <div>
    <el-card class="box-card">
      <el-table
        :data="users"
        style="width: 100%">
        <el-table-column
          align="center"
          prop="id"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="头像"
          width="80">
          <template slot-scope="scope">
            <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="用户名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'

export default Vue.extend({
  name: 'UserIndex',
  data () {
    return {
      users: [],
      filter: {
        current: 1,
        size: 100
      },
      roleIdList: [] as number[],
      roles: [],
      dialogVisible: false,
      userId: null
    }
  },

  created () {
    this.getUserPages()
    this.getAllRoles()
  },

  methods: {
    async getUserPages () {
      const { data } = await getUserPages(this.filter)
      if (data.code === '000000') {
        this.users = data.data.records
      }
    },

    async getAllRoles () {
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.roles = data.data
      }
    },

    async getUserRoles (id: number) {
      const { data } = await getUserRoles(id)
      if (data.code === '000000') {
        this.roleIdList = data.data.map((item: any) => item.id)
      }
    },

    handleEdit (row: any) {
      this.userId = row.id
      this.getUserRoles(row.id)
      this.dialogVisible = true
    },

    async onSubmit () {
      const { data } = await allocateUserRoles({
        userId: this.userId,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配成功')
        this.dialogVisible = false
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
