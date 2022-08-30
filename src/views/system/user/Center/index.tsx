import { defineComponent, computed } from 'vue';
import { useStore } from '@/store/system/user';
import './index.less';

export default defineComponent({
  isPage: true,
  name: 'UserCenter',
  setup() {
    const store = useStore();
    return {
      nickname: computed(() => store.info?.nickName),
      userInfo: computed(() => store.info),
      avatar: computed(() => store.info?.avatar),
      role: computed(() => store.role),
    };
  },
  render() {
    const { avatar, nickname, userInfo, role } = this;
    return (
      <div class="page-header-index-wide page-header-wrapper-grid-content-main">
        <a-row gutter={24}>
          <a-col md={24} lg={7}>
            <a-card bordered={false}>
              <div class="account-center-avatarHolder">
                <div class="avatar">
                  <img src={avatar} />
                </div>
                <div class="username">{nickname}</div>
                <div class="bio">{userInfo?.profile}</div>
              </div>
              <div class="account-center-detail">
                <p>
                  <i class="title"></i>
                  {role?.roleName}
                </p>
              </div>
              <a-divider />
            </a-card>
          </a-col>
        </a-row>
      </div>
    );
  },
});
