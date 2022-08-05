import { editRolePermissionById } from '@/api/system/role';
import { getMenuMap } from '@/api/system/menu';
import { foreachTree } from '@/utils/utils';
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
import './index.less';

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

export type ActionType = 'edit' | 'add' | 'query';

const replaceFields = { children: 'children', title: 'name', key: 'id' };

export default defineComponent({
  emits: ['update'],
  setup(_props: Common.Params, { emit }) {
    // 弹窗显示
    const visible = ref(false);
    const formData = ref<FormData>(defaultFormData);

    const autoExpandParent = ref(true);

    const checkedKeys = ref<number[]>([]);
    const handleSelect = function () {};
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
      autoExpandParent,
      handleOk,
      handleCancel,
      checkedKeys,
      treeData,
      handleSelect,
      show,
    };
  },
  data() {
    return {};
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
    const {
      visible,
      handleOk,
      handleCancel,
      checkedKeys,
      handleSelect,
      treeData,
      autoExpandParent,
    } = this;

    return (
      <action-modal
        title="菜单权限"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        permission="system:role:editPermission"
      >
        <a-tree
          v-model={checkedKeys}
          checkable
          checkStrictly
          autoExpandParent={autoExpandParent}
          treeData={treeData}
          replaceFields={replaceFields}
          onCheck={handleSelect}
        />
      </action-modal>
    );
  },
});
