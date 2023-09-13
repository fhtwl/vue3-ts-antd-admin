import { editRolePermissionById } from '@/api/system/role';
import { getMenuMap } from '@/api/system/menu';
import { defineComponent, getCurrentInstance, ref } from 'vue';
import PermissionModal from '@/components/PermissionModal/index.vue';

export interface MenuPermissionFormData {
  name: string;
  parentId: number | undefined;
  show: Common.BooleanNumber;
  path: string;
  menuIds: string;
  id: number;
}

const defaultFormData: MenuPermissionFormData = {
  name: '',
  parentId: undefined,
  show: 1,
  path: '',
  menuIds: '',
  id: 0,
};

const fieldNames = { children: 'children', title: 'name', key: 'id' };

export default defineComponent({
  components: { PermissionModal },
  emits: ['update'],
  setup(_props: Common.Params, { emit }) {
    // 弹窗显示
    const visible = ref(false);
    const formData = ref<MenuPermissionFormData>(defaultFormData);
    const instance = getCurrentInstance()!;
    const checkedKeys = ref<number[]>([]);
    const handleCheck = function ({ checked }: { checked: number[] }) {
      checkedKeys.value = checked;
    };

    const treeData = ref<System.Menu[]>([]);

    const handleCancel = function () {
      visible.value = false;
      formData.value = {
        ...defaultFormData,
      };
      emit('update');
    };
    const handleOk = function () {
      const ids = checkedKeys.value.join(',');
      confirmLoading.value = true;
      editRolePermissionById({
        ids,
        roleId: formData.value.id,
      }).then(() => {
        instance.proxy!.$message.success('修改成功');
        confirmLoading.value = false;
        handleCancel();
      });
    };

    const show = function (val: MenuPermissionFormData) {
      getMenuMapData();
      formData.value = {
        ...formData.value,
        ...val,
      };
      checkedKeys.value = (val.menuIds || '')
        .split(',')
        .map((str) => Number(str));
      visible.value = true;
    };
    const confirmLoading = ref(false);
    const getMenuMapData = () => {
      getMenuMap().then((data) => {
        treeData.value = [...data];
      });
    };
    return {
      visible,
      handleOk,
      handleCancel,
      checkedKeys,
      treeData,
      show,
      handleCheck,
      instance,
      confirmLoading,
    };
  },

  render() {
    const { visible, handleOk, handleCancel, treeData, confirmLoading } = this;
    // checkedKeys 使用解构不会触发响应式
    return (
      <PermissionModal
        title="菜单权限"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        permission="system:role:editPermission"
        confirmLoading={confirmLoading}
      >
        <a-tree
          v-model:checkedKeys={this.checkedKeys}
          checkable
          checkStrictly
          autoExpandParent
          treeData={treeData}
          fieldNames={fieldNames}
          onCheck={this.handleCheck}
        />
      </PermissionModal>
    );
  },
});
