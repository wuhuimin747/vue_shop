<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryParam.query" clearable @clear="getUserList">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="data">
            <el-switch v-model="data.row.mg_state" @change="mgstateChange(data.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="data">
            <el-button type="primary" icon="el-icon-edit" circle size="small" @click="showEditDialog(data.row.id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="small" @click="removeUserById(data.row.id)">
            </el-button>
            <el-tooltip :enterable="false" effect="light" content="分配角色" placement="top-start">
              <el-button @click="setRole(data.row)" type="warning" icon="el-icon-setting" circle size="small">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryParam.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
      <!-- 添加用户表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoledialogVisible" width="50%" @close="closeSetRoleDialog">
      <p>{{'用户名： ' + user.username}}</p>
      <p>{{'角色： ' + user.role_name}}</p>
      <p>
        <el-select v-model="roleId" placeholder="请选择">
          <el-option v-for="item in rolelist" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      tableData: [],
      // 查询参数
      queryParam: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 用户数据总数
      total: 0,
      // 添加用户对话框的显隐
      dialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色对话框的显隐
      setRoledialogVisible: false,
      // 选中的用户信息
      user: {},
      // 角色列表
      rolelist: [],
      // 选中的角色
      roleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.axios.get('users', {
        params: this.queryParam
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.tableData = res.data.users
      this.total = res.data.total
    },
    // size变化时的监听函数
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryParam.pagesize = newSize
      this.getUserList()
    },
    // pagenum变化时的监听函数
    handleCurrentChange(newNum) {
      // console.log(newNum);
      this.queryParam.pagenum = newNum
      this.getUserList()
    },
    // 监听用户状态mg_state的变化，并更新到数据库中
    async mgstateChange(info) {
      const { data: res } = await this.axios.put(
        `users/${info.id}/state/${info.mg_state}`
      )
      if (res.meta.status !== 200) {
        info.mg_state = !info.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功')
    },
    // 清除表单
    closeDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        const { data: res } = await this.axios.post('users', this.addForm)
        if (res.meta.status === 201) {
          this.$message.success('用户创建成功')
          this.dialogVisible = false
          this.getUserList()
        } else {
          this.$message.error('用户创建失败')
        }
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.axios.get('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.axios.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.axios.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 分配角色
    setRole(info) {
      console.log(info)
      this.user = {
        id: info.id,
        role_name: info.role_name,
        username: info.username
      }
      // 获取所有的权限
      this.axios.get('roles').then(ret => {
        this.rolelist = ret.data.data;
      }).catch(ret => {
        this.$message.error('获取角色列表失败！')
      });
      this.setRoledialogVisible = true
    },
    // 点击确定分配角色
    saveRole() {
      this.axios.put(`users/${this.user.id}/role`, {
        rid : this.roleId
      }).then(ret => {
        this.getUserList();
        this.$message.success('分配角色成功！')
      }).catch(ret => {
        this.$message.error('分配角色失败！')
      })
      this.setRoledialogVisible = false;
    },
    // 关闭对话框
    closeSetRoleDialog() {
      this.user = {};
      this.roleId = '';
    }
  }
}
</script>
