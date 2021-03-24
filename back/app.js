// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用

  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    let path = this.app.config.dataSourcePath
    if(!path){
      console.error('未配置 DATA SOURCE PATH!')
    }
    require('./app/utils/file').setPath(path)
  }

  async willReady() {
  }

  async didReady() {
  }

  async serverDidReady() {
    require('./app/utils/stc').loadCube();
  }
}

module.exports = AppBootHook;