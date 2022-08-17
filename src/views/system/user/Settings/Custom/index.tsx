import { defineComponent } from 'vue';
import { colorList } from '@/components/SettingDrawer/settingConfig';
import { useStore } from '@/store/system/theme';
import {
  NAV_THEME,
  TOGGLE_HIDE_SETTING,
  TOGGLE_NAV_THEME,
} from '@/store/system/theme/const';
import { storeToRefs } from 'pinia';
export default defineComponent({
  setup() {
    const colorFilter = function (color: string) {
      const c = colorList.find((o) => o.color === color);
      return c && c.key;
    };
    const themeStore = useStore();

    const handleChange = function (checked: boolean) {
      const navTheme = checked ? NAV_THEME.DARK : NAV_THEME.LIGHT;
      themeStore[TOGGLE_NAV_THEME](navTheme);
    };
    const handleHideSettingChange = function (checked: boolean) {
      themeStore[TOGGLE_HIDE_SETTING](checked);
    };

    return {
      colorFilter,
      handleChange,
      handleHideSettingChange,
      themeStore,
    };
  },
  render() {
    const { handleChange, colorFilter, handleHideSettingChange, themeStore } =
      this;
    const { navTheme, primaryColor, hideSetting } = storeToRefs(themeStore);
    return (
      <a-list itemLayout="horizontal">
        <a-list-item>
          <a-list-item-meta>
            <template v-slot:title>
              <a>风格配色</a>
            </template>
            <template v-slot:description>
              <span>整体风格配色设置</span>
            </template>
          </a-list-item-meta>
          <template v-slot:actions>
            <a-switch
              checkedChildren="暗色"
              unCheckedChildren="白色"
              defaultChecked={(navTheme.value === 'dark' && true) || false}
              onChange={handleChange}
            />
          </template>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <template v-slot:title>
              <a>主题色</a>
            </template>
            <template v-slot:description>
              <span>
                页面风格配色： <a>{colorFilter(primaryColor.value)}</a>
              </span>
            </template>
          </a-list-item-meta>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <template v-slot:title>
              <a>主题面板设置</a>
            </template>
            <template v-slot:description>
              <span>是否隐藏面板</span>
            </template>
          </a-list-item-meta>
          <template v-slot:actions>
            <a-switch
              v-model={hideSetting.value}
              checkedChildren="隐藏"
              unCheckedChildren="显示"
              onChange={handleHideSettingChange}
            />
          </template>
        </a-list-item>
      </a-list>
    );
  },
});
