import { defineComponent } from 'vue';
import { colorList } from '@/components/SettingDrawer/settingConfig';
import { useStore } from '@/store/system/theme';
import {
  NavThemeType,
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

    const handleChange = function (navTheme: NavThemeType) {
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

    const list = [
      {
        render: () => {
          const itemSlots = {
            actions: () => (
              <a-switch
                checkedChildren="暗色"
                unCheckedChildren="白色"
                checkedValue={NAV_THEME.DARK}
                unCheckedValue={NAV_THEME.LIGHT}
                v-model:checked={navTheme.value}
                onChange={handleChange}
              />
            ),
          };
          const itemMetaSlots = {
            title: () => <a>风格配色</a>,
            description: () => <span>整体风格配色设置</span>,
          };
          return (
            <a-list-item v-slots={itemSlots}>
              <a-list-item-meta v-slots={itemMetaSlots} />
            </a-list-item>
          );
        },
      },
      {
        render: () => {
          const itemMetaSlots = {
            title: () => <a>主题色</a>,
            description: () => (
              <span>
                页面风格配色： <a>{colorFilter(primaryColor.value)}</a>
              </span>
            ),
          };
          return (
            <a-list-item>
              <a-list-item-meta v-slots={itemMetaSlots} />
            </a-list-item>
          );
        },
      },

      {
        render: () => {
          const itemSlots = {
            actions: () => (
              <a-switch
                v-model:checked={hideSetting.value}
                checkedChildren="隐藏"
                unCheckedChildren="显示"
                onChange={handleHideSettingChange}
              />
            ),
          };
          const itemMetaSlots = {
            title: () => <a>主题面板设置</a>,
            description: () => <span>是否隐藏面板</span>,
          };
          return (
            <a-list-item v-slots={itemSlots}>
              <a-list-item-meta v-slots={itemMetaSlots} />
            </a-list-item>
          );
        },
      },
    ];
    return (
      <a-list itemLayout="horizontal">
        {list.map((item) => {
          return item.render();
        })}
      </a-list>
    );
  },
});
