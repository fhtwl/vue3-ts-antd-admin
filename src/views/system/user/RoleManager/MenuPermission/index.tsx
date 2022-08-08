import { editRolePermissionById } from '@/api/system/role';
import { getMenuMap } from '@/api/system/menu';
import { defineComponent, getCurrentInstance, ref } from 'vue';
import PermissionModal from '@/components/PermissionModal/index.vue';

interface FormData {
  name: string;
  parentId: number | undefined;
  show: Common.BooleanNumber;
  path: string;
  menuIds: string;
  id: number;
}

const defaultFormData: FormData = {
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
    const formData = ref<FormData>(defaultFormData);

    const checkedKeys = ref<number[]>([]);
    const handleCheck = function (keys: number[]) {
      checkedKeys.value = keys;
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
      editRolePermissionById({
        ids,
        roleId: formData.value.id,
      }).then(() => {
        const { proxy } = getCurrentInstance()!;
        proxy!.$message.success('修改成功');
        handleCancel();
      });
    };

    const show = function (val: FormData) {
      formData.value = {
        ...formData.value,
        ...val,
      };
      checkedKeys.value = val.menuIds.split(',').map((str) => Number(str));
      visible.value = true;
    };

    return {
      visible,
      handleOk,
      handleCancel,
      checkedKeys,
      treeData,
      show,
      handleCheck,
    };
  },
  mounted() {
    this.getMenuMap();
  },

  methods: {
    getMenuMap() {
      getMenuMap().then((data) => {
        this.treeData = [...data];
      });
    },
  },
  render() {
    const { visible, handleOk, handleCancel, treeData } = this;
    // checkedKeys 使用解构不会触发响应式
    return (
      <PermissionModal
        title="菜单权限"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        permission="system:role:editPermission"
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
