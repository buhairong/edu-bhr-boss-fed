<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span>分配菜单</span>
      </div>
      <el-tree
        ref="menu-tree"
        :data="menus"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        node-key="id"
        show-checkbox
        default-expand-all
      ></el-tree>
      <div style="margin-top: 20px;">
        <el-button size="mini" @click="resetChecked">清空</el-button>
        <el-button size="mini" type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',

  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },

  data () {
    return {
      menus: [],
      checkedKeys: [] as number[],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      }
    }
  },

  created () {
    this.getMenuNodeList()
    this.getRoleMenus()
  },

  methods: {
    async getMenuNodeList () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },

    async getRoleMenus () {
      const { data } = await getRoleMenus(this.id)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },

    getCheckedKeys (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id]
        }
        if (menu.subMenuList && menu.subMenuList.length) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },

    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    },

    async onSave () {
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      await allocateRoleMenus({
        roleId: this.id,
        menuIdList
      })
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped></style>
