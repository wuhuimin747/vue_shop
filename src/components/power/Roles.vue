<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" class="add_btn">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="data">
            <el-row v-for="(item1, index1) in data.row.children" :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vertical_center']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsByRole(data.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vertical_center']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightsByRole(data.row, item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable
                      @close="removeRightsByRole(data.row, item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 数据列 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="300px">
          <template slot-scope="data">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(data.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightdialogVisible" width="30%" @close="closeSetRightsDialog">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="treeData" node-key="id" :props="treeProps" show-checkbox :default-expand-all="true" :default-checked-keys="checkedRights">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 分配权限对话框的显隐
      setRightdialogVisible: false,
      // 属性控件的数据
      treeData: [],
      // 设置子节点的属性名和text文本对应属性名
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 指定角色已经拥有的权限
      checkedRights: [],
      // 指定角色
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.axios.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolelist = res.data

      // console.log(this.rolelist)
    },
    // 删除指定角色的指定权限
    async removeRightsByRole(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      this.axios
        .delete(`roles/${role.id}/rights/${rightId}`)
        .then(ret => {
          this.$message.success('删除权限成功')
          // 更新当前角色的权限数据，而不是刷新页面，为了小箭头能展开
          role.children = ret.data.data
        })
        .catch(ret => {
          this.$message.error('删除权限失败')
        })
    },
    // 分配角色权限
    showSetRightDialog(role) {
      // 获取所有的权限
      this.axios.get('rights/tree').then(ret => {
        this.treeData = ret.data.data;
      }).catch(ret => {
        this.$message.error('获取权限树失败');
      });
      // 获取该角色下已有的三级权限ID并返显到树结构上
      this.getThirdRightsId(role, this.checkedRights);
      // console.log(this.checkedRights);
      // 打开分配权限的对话框
      this.setRightdialogVisible = true;
      this.roleId = role.id;
    },
    // 获取该角色下已有的三级权限ID
    getThirdRightsId(role, arr) {
      if (!role.children) {
        arr.push(role.id);
      } else {
        role.children.forEach(child => {
          this.getThirdRightsId(child, arr);
        })
      }
    },
    // 关闭分配权限的对话框
    closeSetRightsDialog() {
      // 清空指定角色已经拥有的权限
      this.checkedRights = [];
      this.roleId = '';
    },
    // 点击确定为角色分配权限
    setRights() {
      if (this.checkedRights) {
        this.axios.post(`roles/${this.roleId}/rights`,{
          rids: [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys(),
          ].join(',')
        }).then(ret => {
          this.$message.success('分配权限成功');
          this.getRolesList();
        }).catch(ret => {
          this.$message.error('分配权限失败');
        })
      }
      this.setRightdialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vertical_center {
  display: flex;
  align-items: center;
}

.add_btn {
  margin-bottom: 10px;
}
</style>
