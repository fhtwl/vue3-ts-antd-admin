import { defineComponent } from 'vue';
import './index.less';
export default defineComponent({
  render() {
    return (
      <div class="global-footer">
        <div class="links">
          <a href="https://fhtwl.gitee.io/" target="_blank">
            Blog
          </a>
          <a href="https://gitee.com/fhtwl/low-code-admin" target="_blank">
            Gitee
          </a>
          <a href="https://gitee.com/fhtwl" target="_blank">
            @Fhtwl
          </a>
        </div>
        <div class="copyright">
          Copyright &copy; 2022 fhtwl 备案号:
          <a href="https://beian.miit.gov.cn/">鄂ICP备2022005996号-1</a>
        </div>
      </div>
    );
  },
});
