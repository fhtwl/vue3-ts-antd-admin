export default () => {
  return {
    message: '测试账号',
    duration: null,
    description: () => {
      return (
        <div>
          <div>管理员: admin/admin</div>
          <div>用户: user/user</div>
        </div>
      );
    },
  };
};
