import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import TableLayout from '@/components/TableLayout';
import { getRoleList, deleteRoleByIds } from '@/api/system/role';
import { ToolButton, VueComponentNode } from '@/components/TableLayout/Tool';
import { CommonFormItem } from '@/components/CommonForm';

import AddRole, { RoleFormData } from './AddRole';
import MenuPermission, { MenuPermissionFormData } from './MenuPermission';

export default defineComponent({
  setup() {
    const addRoleRef = ref<InstanceType<typeof AddRole>>();
    const tableLayoutRef = ref<InstanceType<typeof TableLayout>>();
    const menuPermissionRef = ref<InstanceType<typeof MenuPermission>>();
    const instance = getCurrentInstance();

    const formData = reactive<{ name: string }>({
      name: '',
    });
    const formJson = reactive<CommonFormItem[]>([
      {
        type: 'input',
        label: '名称',
        fieldName: 'name',
        extraConfig: {
          // className: "row",
        },
        dataType: String,
      },
    ]);

    const columns = reactive<Common.TableColumns[]>([
      {
        title: '名称',
        dataIndex: 'name',
        width: 80,
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 120,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        width: 80,
      },
    ]);

    const handleAddClick = function () {
      console.log(addRoleRef);
      addRoleRef.value?.show('add');
    };
    const handleEditClick = function (
      _selectKeys: number[],
      selectNodes: RoleFormData[]
    ) {
      addRoleRef.value!.show('edit', selectNodes[0]);
    };
    const handleDeleteClick = function (
      _selectKeys: number[],
      selectNodes: RoleFormData[]
    ) {
      instance?.proxy!.$confirm({
        title: '是否确认删除',
        content: '删除该菜单会删除该菜单的所有子菜单',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        maskClosable: false,
        onOk: () => {
          const ids: number[] = [];
          const each = (tree: Common.TreeNode[]) => {
            tree.forEach((item) => {
              ids.push(item.id);
              if (item.children) {
                each(item.children);
              }
            });
          };
          each(selectNodes as unknown as Common.TreeNode[]);
          deleteRoleByIds({
            ids: ids.join(','),
          }).then(() => {
            instance?.proxy!.$message.success('删除成功');
            reSearch();
          });
        },
      });
    };
    const handleDetailsClick = function (
      _selectKeys: number[],
      selectNodes: RoleFormData[]
    ) {
      addRoleRef?.value?.show('query', selectNodes[0]);
    };
    const reSearch = function () {
      tableLayoutRef?.value?.resetSearch();
    };
    const handleEditMenuClick = function (
      _selectKeys: number[],
      selectNodes: RoleFormData[]
    ) {
      menuPermissionRef?.value?.show(
        selectNodes[0] as unknown as MenuPermissionFormData
      );
    };
    const buttons = reactive<ToolButton<number, RoleFormData>[]>([
      {
        key: 'approve-add',
        onClick: handleAddClick,
        action: 'add',
        vAction: 'system:role:add',
        icon: 'add',
        text: '新增',
      },
      {
        key: 'approve-edit',
        onClick: handleEditClick,
        action: 'edit',
        vAction: 'system:role:edit',
        icon: 'edit',
        text: '编辑',
      },
      {
        key: 'approve-delete',
        onClick: handleDeleteClick,
        action: 'delete',
        vAction: 'system:role:delete',
        icon: 'delete',
        text: '删除',
      },
      {
        key: 'approve-query',
        onClick: handleDetailsClick,
        action: 'query',
        vAction: 'system:role:query',
        icon: 'details',
        text: '详情',
      },
      {
        key: 'approve-permission',
        onClick: handleEditMenuClick,
        action: 'query',
        vAction: 'system:role:editPermission',
        icon: 'setting',
        text: '权限设置',
      },
    ]);

    return {
      formJson,
      columns,
      buttons,
      reSearch,
      formData,
      handleAddClick,
      addRoleRef,
      instance,
      menuPermissionRef,
    };
  },
  render() {
    const { buttons, formJson, columns, reSearch } = this;
    return (
      <div class="container">
        <TableLayout
          ref="tableLayoutRef"
          buttons={buttons}
          formJson={formJson}
          columns={columns}
          search={getRoleList}
        ></TableLayout>
        <AddRole ref="addRoleRef" onUpdate={reSearch} />
        <MenuPermission ref="menuPermissionRef" onUpdate={reSearch} />
      </div>
    );
  },
});
