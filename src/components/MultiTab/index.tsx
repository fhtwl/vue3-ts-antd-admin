import { defineComponent } from 'vue';
import { RouteLocationNormalized } from 'vue-router';

type MultiTabAction = 'closeThat' | 'closeLeft' | 'closeRight' | 'closeAll';

export default defineComponent({
  name: 'MultiTab',
  data() {
    return {
      pathList: [] as string[],
      pages: [] as RouteLocationNormalized[],
      activeKey: '' as string,
      newTabIndex: 0,
    };
  },
  watch: {
    $route: function (newVal: RouteLocationNormalized) {
      this.activeKey = newVal.path;

      if (this.pathList.indexOf(newVal.path) < 0) {
        this.pathList.push(newVal.path);
        this.pages.push(newVal);
      } else {
        const index = this.pages.findIndex((page) => page.path === newVal.path);
        this.pages[index] = newVal;
      }
    },
    // activeKey: function (newPathKey) {
    //   console.log(newPathKey);
    //   this.$router.push({ path: newPathKey });
    // },
  },
  created() {
    this.pages.push(this.$route);
    this.pathList.push(this.$route.path);
    this.selectedLastPath();
  },
  methods: {
    handleEdit(targetKey: string, action: MultiTabAction) {
      console.log(action, targetKey);
      this[action](targetKey);
    },
    remove(targetKey: string) {
      this.pages = this.pages.filter((page) => page.path !== targetKey);
      this.pathList = this.pathList.filter((path) => path !== targetKey);
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      // if (!this.pathList.includes(this.activeKey)) {
      if (!this.pathList.includes(this.activeKey.split('?')[0])) {
        this.selectedLastPath();
      }
    },
    selectedLastPath() {
      const last = this.pathList[this.pathList.length - 1];
      const lastPage = this.pages.find((page) => page.path === last);
      this.activeKey = lastPage?.path || '';
      this.$router.push({ path: lastPage?.fullPath || '' });
    },

    // content menu
    closeThat(e: string) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.pathList.length > 1) {
        this.remove(e);
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭');
      }
    },
    closeLeft(e: string) {
      const currentIndex = this.pathList.indexOf(e);
      if (currentIndex > 0) {
        this.pathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message.info('左侧没有标签');
      }
    },
    closeRight(e: string) {
      const currentIndex = this.pathList.indexOf(e);
      if (currentIndex < this.pathList.length - 1) {
        this.pathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message.info('右侧没有标签');
      }
    },
    closeAll(key: string) {
      const currentIndex = this.pathList.indexOf(key);
      this.pathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item);
        }
      });
    },
    closeMenuClick(action: MultiTabAction, route: string) {
      console.log(action, route);
      this[action](route);
    },
    renderTabPaneMenu(e: string) {
      return (
        <a-menu
          onClick={({ key }: { key: MultiTabAction }) => {
            this.closeMenuClick(key, e);
          }}
        >
          <a-menu-item key="closeThat">关闭当前标签</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
          <a-menu-item key="closeAll">关闭全部</a-menu-item>
        </a-menu>
      );
    },
    // render
    renderTabPane(title: string, keyPath: string) {
      const menu = this.renderTabPaneMenu(keyPath);

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>{title}</span>
        </a-dropdown>
      );
    },
    handleChange(key: string) {
      console.log(key);
      this.activeKey = key;
      this.$router.push({ path: key });
    },
  },
  render() {
    const {
      handleEdit,
      $data: { pages },
    } = this;
    console.log(pages);
    const panes = pages.map((page) => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(
            (page.meta.customTitle || page.meta.title) as string,
            page.path
          )}
          key={page.path}
          closable={pages.length > 1}
        ></a-tab-pane>
      );
    });

    return (
      <div class="ant-pro-multi-tab">
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            type={'editable-card'}
            v-model:activeKey={this.activeKey}
            onChange={this.handleChange}
            tabBarStyle={{
              background: '#FFF',
              margin: 0,
              paddingLeft: '16px',
              paddingTop: '1px',
            }}
            onEdit={handleEdit}
          >
            {panes}
          </a-tabs>
        </div>
      </div>
    );
  },
});
