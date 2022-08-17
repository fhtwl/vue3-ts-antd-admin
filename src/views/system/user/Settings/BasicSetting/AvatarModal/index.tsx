import { defineComponent, ref, reactive, getCurrentInstance } from 'vue';
import 'vue-cropper/dist/index.css';
import './index.less';
import { VueCropper } from 'vue-cropper';
import { uploadImg } from '@/api/system/upload';
import {
  MinusOutlined,
  PlusOutlined,
  RedoOutlined,
  UndoOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue';

interface Previews {
  url: string;
  img: Common.Params;
}

export default defineComponent({
  emits: ['ok'],
  setup(_props, { emit }) {
    const instance = getCurrentInstance();
    const visible = ref<boolean>(false);
    const confirmLoading = ref<boolean>(false);
    const fileList = reactive<File[]>([]);
    const uploading = ref<boolean>(false);
    const options = ref({
      // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      img: '',
      autoCrop: true,
      autoCropWidth: 200,
      autoCropHeight: 200,
      fixedBox: true,
    });
    const previews = ref<Previews>();
    const imgFile = ref<File>();
    const edit = function () {
      visible.value = true;
    };
    const close = function () {
      visible.value = false;
    };
    const hanldeCancel = function () {
      close();
    };

    const cropperRef = ref<InstanceType<typeof VueCropper>>();
    const handleScaleClick = function (num: number) {
      cropperRef.value?.changeScale(num || 1);
    };

    const realTime = function (data: Previews) {
      console.log(data);
      previews.value = data;
    };

    const handleRotateLeftClick = function () {
      cropperRef.value.rotateLeft();
    };
    const handleRotateRightClick = function () {
      cropperRef.value.rotateRight();
    };

    const handleFinish = function () {
      const formData = new FormData();
      formData.append('img', imgFile.value as unknown as string);
      uploadImg(formData).then((response) => {
        console.log('upload response:', response);
        instance?.proxy?.$message.success('上传成功');
        emit('ok', response.path);
        visible.value = false;
      });
    };

    const handleBeforeUpload = function (file: File) {
      imgFile.value = file;
      const reader = new FileReader();
      // 转化为base64
      reader.readAsDataURL(file);
      reader.onload = () => {
        options.value.img = reader.result as string;
      };
    };
    return {
      visible,
      confirmLoading,
      fileList,
      uploading,
      options,
      previews,
      imgFile,
      cropperRef,
      edit,
      hanldeCancel,
      realTime,
      handleScaleClick,
      handleRotateLeftClick,
      handleRotateRightClick,
      handleFinish,
      handleBeforeUpload,
    };
  },
  render() {
    const {
      visible,
      confirmLoading,
      hanldeCancel,
      previews,
      options,
      realTime,
      handleScaleClick,
      handleRotateLeftClick,
      handleRotateRightClick,
      handleFinish,
      handleBeforeUpload,
    } = this;
    return (
      <a-modal
        title="修改头像"
        visible={visible}
        maskClosable={false}
        confirmLoading={confirmLoading}
        width={800}
        footer={null}
        onCancel={hanldeCancel}
      >
        <div class="avatar-body">
          <div class="avatar-content">
            <VueCropper
              ref="cropperRef"
              img={options.img}
              info="true"
              autoCrop={options.autoCrop}
              autoCropWidth={options.autoCropWidth}
              autoCropHeight={options.autoCropHeight}
              fixedBox={options.fixedBox}
              onRealTime={realTime}
            />

            <div class="avatar-upload-preview">
              <div class="avatar-wrap">
                <img src={previews?.url} style={previews?.img} />
              </div>
            </div>
          </div>

          <br />
          <div class="tool">
            <a-upload
              name="file"
              beforeUpload={handleBeforeUpload}
              showUploadList={false}
            >
              <a-button icon={<UploadOutlined />}>选择图片</a-button>
            </a-upload>
            <a-button
              icon={<PlusOutlined />}
              onClick={() => handleScaleClick(1)}
            />
            <a-button
              icon={<MinusOutlined />}
              onClick={() => handleScaleClick(-1)}
            />
            <a-button icon={<UndoOutlined />} onClick={handleRotateLeftClick} />
            <a-button
              icon={<RedoOutlined />}
              onClick={handleRotateRightClick}
            />
            <a-button type="primary" onClick={handleFinish}>
              保存
            </a-button>
          </div>
        </div>
      </a-modal>
    );
  },
});
