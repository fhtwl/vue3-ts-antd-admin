import { defineComponent } from 'vue';
import { RouteLocationNormalized } from 'vue-router';

type MultiTabAction = 'closeThat' | 'closeLeft' | 'closeRight' | 'closeAll';

export default defineComponent({
  name: 'MultiTab',
  data() {
    return {
      fullPathList: [] as string[],
      pages: [] as RouteLocationNormalized[],
      activeKey: '' as string,
      newTabIndex: 0,
    };
  },
  watch: {
    $route: function (newVal: RouteLocationNormalized) {
      this.activeKey = newVal.fullPath;
      console.log(this.fullPathList, this.fullPathList.indexOf(newVal.path));
      if (this.fullPathList.indexOf(newVal.path) < 0) {
        this.fullPathList.push(newVal.path);
        this.pages.push(newVal);
      } else {
        const index = this.pages.findIndex((page) => page.path === newVal.path);
        this.pages[index] = newVal;
        this.activeKey = newVal.fullPath;
      }
      console.log(newVal, this.activeKey, this.pages);
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey });
    },
  },
  created() {
    // // bind event
    // open: function (config) {
    //   events.$emit('open', config)
    // }
    // rename: function (key, name) {
    //   events.$emit('rename', { key: key, name: name })
    // }
    // /**
    //  * close current page
    //  */
    // closeCurrentPage: function () {
    //   this.close()
    // }
    // /**
    //  * close route fullPath tab
    //  * @param config
    //  */
    // close: function (config) {
    //   events.$emit('close', config)
    // }
    // events
    //   .$on('open', (val: string) => {
    //     if (!val) {
    //       throw new Error(`multi-tab: open tab ${val} err`);
    //     }
    //     this.activeKey = val;
    //   })
    //   .$on('close', (val: string) => {
    //     if (!val) {
    //       this.closeThat(this.activeKey);
    //       return;
    //     }
    //     this.closeThat(val);
    //   })
    //   .$on('rename', ({ key, name }: { key: string; name: string }) => {
    //     console.log('rename', key, name);
    //     try {
    //       const item = this.pages.find((item) => item.path === key);
    //       item!.meta.customTitle = name;
    //       this.$forceUpdate();
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   });

    this.pages.push(this.$route);
    this.fullPathList.push(this.$route.path);
    this.selectedLastPath();
  },
  methods: {
    onEdit(targetKey: string, action: MultiTabAction) {
      this[action](targetKey);
    },
    remove(targetKey: string) {
      this.pages = this.pages.filter((page) => page.fullPath !== targetKey);
      this.fullPathList = this.fullPathList.filter(
        (path) => path !== targetKey
      );
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      // if (!this.fullPathList.includes(this.activeKey)) {
      if (!this.fullPathList.includes(this.activeKey.split('?')[0])) {
        this.selectedLastPath();
      }
    },
    selectedLastPath() {
      const last = this.fullPathList[this.fullPathList.length - 1];
      this.activeKey =
        this.pages.find((page) => page.path === last)?.fullPath || '';
    },

    // content menu
    closeThat(e: string) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.fullPathList.length > 1) {
        this.remove(e);
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭');
      }
    },
    closeLeft(e: string) {
      const currentIndex = this.fullPathList.indexOf(e);
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message.info('左侧没有标签');
      }
    },
    closeRight(e: string) {
      const currentIndex = this.fullPathList.indexOf(e);
      if (currentIndex < this.fullPathList.length - 1) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message.info('右侧没有标签');
      }
    },
    closeAll(key: string) {
      const currentIndex = this.fullPathList.indexOf(key);
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item);
        }
      });
    },
    closeMenuClick(action: MultiTabAction, route: string) {
      this[action](route);
    },
    renderTabPaneMenu(e: string) {
      return (
        <a-menu
          {...{
            on: {
              click: ({ key }: { key: MultiTabAction }) => {
                this.closeMenuClick(key, e);
              },
            },
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
  },
  render() {
    const {
      onEdit,
      $data: { pages },
    } = this;
    const panes = pages.map((page) => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(
            (page.meta.customTitle || page.meta.title) as string,
            page.fullPath
          )}
          key={page.fullPath}
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
            v-model={this.activeKey}
            tabBarStyle={{
              background: '#FFF',
              margin: 0,
              paddingLeft: '16px',
              paddingTop: '1px',
            }}
            {...{ on: { edit: onEdit } }}
          >
            {panes}
          </a-tabs>
        </div>
      </div>
    );
  },
});
