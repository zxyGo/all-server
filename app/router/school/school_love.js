module.exports = app => {
  const apiSchoolLoveRouter = app.router.namespace('/api/school/love');
  const {controller} = app;
  apiSchoolLoveRouter.post('/create', controller.school.schoolLove.create); // 新增表白内容
  // apiSchoolUserRouter.post('/update', controller.school.schoolUser.update); // 用户信息更新
  // apiSchoolUserRouter.get('/province', controller.school.schoolUser.province); // 获取学校省级
  // apiSchoolUserRouter.post('/city', controller.school.schoolUser.city); // 获取学校城市
  // apiSchoolUserRouter.post('/school', controller.school.schoolUser.school); // 获取学校
}
