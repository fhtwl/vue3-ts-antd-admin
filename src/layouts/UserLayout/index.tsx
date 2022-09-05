import { defineComponent } from 'vue';
import './index.less';

export default defineComponent({
  name: 'UserLayout',
  // mixins: [deviceMixin],
  data() {
    return {};
  },
  mounted() {
    document.body.classList.add('userLayout');
  },
  beforeUnmount() {
    document.body.classList.remove('userLayout');
  },
  render() {
    return (
      <div id="userLayout" class="user-layout-wrapper">
        <div class="container">
          <div class="user-layout-content">
            <div class="top">
              <div class="header">
                <a href="/">
                  {/* <!-- <img src="~@/assets/logo.svg" class="logo" alt="logo"> --> */}
                  <span class="title">FHTWL</span>
                </a>
              </div>
              <div class="desc">管理平台</div>
            </div>

            <router-view />

            <div class="footer">
              <div class="links">
                <a href="_self">帮助</a>
                <a href="_self">隐私</a>
                <a href="_self">条款</a>
              </div>
              <div class="copyright">
                Copyright &copy; 2022 fhtwl 备案号:
                <a href="https://beian.miit.gov.cn/">鄂ICP备2022005996号-1</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
