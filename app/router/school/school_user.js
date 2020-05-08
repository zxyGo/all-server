module.exports = app => {
  const apiSchoolUserRouter = app.router.namespace('/api/school/user');
  const {controller} = app;
  apiSchoolUserRouter.post('/create', controller.school.schoolUser.create); // 新增用户
  apiSchoolUserRouter.post('/update', controller.school.schoolUser.update); // 用户信息更新
  apiSchoolUserRouter.get('/province', controller.school.schoolUser.province); // 获取学校省级
  apiSchoolUserRouter.post('/city', controller.school.schoolUser.city); // 获取学校城市
  apiSchoolUserRouter.post('/school', controller.school.schoolUser.school); // 获取学校
}
