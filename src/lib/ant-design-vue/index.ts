import { message, Modal, notification } from 'ant-design-vue';

import { App } from 'vue';

export default function setupAtnd(app: App<Element>) {
  app.config.globalProperties.$message = message;
  app.config.globalProperties.$confirm = Modal.confirm;
  app.config.globalProperties.$notification = notification;
}
