module.exports = {
  devServer: {
    proxy: {
      '/boss': {
        target: 'http://eduboss.lagou.com',
        changeOrigin: true // 把请求头中的 host 配置为 target
      },
      '/front': {
        target: 'http://edufront.lagou.com',
        changeOrigin: true
      }
    }
  },

  css: {
    loaderOptions: {
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: `@import "~@/styles/variables.scss";`
      }
    }
  }
}

/*

chainWebpack: (config) => {
    config.resolve.alias
      .set('@cmp-app', resolve('packages/web/cmp-app/src'))
      .set('@home-app', resolve('packages/web/home-app/src'))
      .set('@red-package', resolve('packages/web-app/packages/red-package/src'))
      .set('@nio-index', resolve('packages/web-h5/packages/nio-index/src'))
      .set('@pe-app', resolve('packages/web-h5/packages/pe-app/src'));
    config.resolve.mainFields
      .add('typescriptSource')
      .add('browser')
      .add('module')
      .add('main');
    config.module
      .rule('html')
      .test(/\.html$/)
      .exclude.add(/index\.html/).end()
      .set('loader', 'vue-template-loader')
      .end();
    config.module
      .rule('jsx')
      .test(/\.jsx$/)
      .include.add(resolve('/node_modules/loca-ui')).end()
      .set('loader', 'babel-loader')
      .end();
    config.plugin('define').tap(args => {
      args[0]['process.env'].RELEASE_VERSION = JSON.stringify('V_201126');
      args[0]['process.env'].RUNTIME_ENV = JSON.stringify(envCode);
      return args
    })
  },
*/
