import { defineComponent, ref, reactive, getCurrentInstance } from 'vue';
import BasicSetting from './BasicSetting';
import Custom from './Custom';
import './index.less';
import Security from './Security';

type MenuType = 'basic' | 'security' | 'custom';
type MenuTab = {
  key: MenuType;
  title: string;
};
export default defineComponent({
  isPage: true,
  name: 'UserSettings',
  setup() {
    const selectedKeys = ref<MenuType[]>(['basic']);
    const menu = reactive<MenuTab[]>([
      {
        key: 'basic',
        title: '基本设置',
      },
      {
        key: 'security',
        title: '安全设置',
      },
      {
        key: 'custom',
        title: '个性化',
      },
    ]);
    const instance = getCurrentInstance();
    const updateMenu = function () {
      const routes = instance?.proxy!.$route.matched.concat();
      selectedKeys.value = [routes!.pop()?.path as unknown as MenuType];
    };
    const handleSelect = function (node: MenuTab) {
      selectedKeys.value = [node.key];
    };

    return {
      selectedKeys,
      menu,
      updateMenu,
      handleSelect,
    };
  },
  render() {
    const { selectedKeys, handleSelect, menu } = this;
    const bodyStyle = {
      padding: '16px 0',
      height: '100%',
    };
    const style = {
      height: '100%',
    };

    return (
      <div class="page-header-index-wide">
        <a-card bordered={false} bodyStyle={bodyStyle} style={style}>
          <div class="account-settings-info-main">
            <div class="account-settings-info-left">
              <a-menu
                mode="inline"
                style=" border: '0'; width: 'auto'"
                selectedKeys={selectedKeys}
                type="inner"
                onSelect={handleSelect}
              >
                {menu.map((item) => {
                  return <a-menu-item key={item.key}>{item.title}</a-menu-item>;
                })}
              </a-menu>
            </div>
            <div class="account-settings-info-right">
              <div class="account-settings-info-title">
                <span>
                  {menu.find((item) => item.key === selectedKeys[0])?.title}
                </span>
              </div>
              {selectedKeys.includes('basic') ? <BasicSetting /> : ''}
              {selectedKeys.includes('custom') ? <Custom /> : ''}
              {selectedKeys.includes('security') ? <Security /> : ''}
            </div>
          </div>
        </a-card>
      </div>
    );
  },
});
