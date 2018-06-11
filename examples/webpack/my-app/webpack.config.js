const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");   //引入对应插件
module.exports = {
  devtool: 'source-map',       //模式选择，这里选择原始代码，因为开发环境不需要去混淆代码。
  mode: 'development',        //环境区分，是开发环境development还是生产环境production
  entry: ['babel-polyfill', './src/index.js'],   //入口文件
  output: {                  
    filename: '[name].js',    //输出文件
    hashDigestLength: 7,   //hash值设置
    path: path.resolve(__dirname, 'build')         //输出文件路径
  },
  module: {
    rules: [
      {
        //匹配js或jsx文件进行编译转换
        test: /\.js|jsx$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015', 'babel-preset-env', 'stage-3'],
            plugins: [["transform-class-properties"],["import",{ "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]]
          }
        }
      },
      {
        //匹配css文件，进行抽离css
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
       //匹配图片
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: [
          'file-loader'
        ]
      },
      {
       //匹配字体
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    //输出特定的html文件
    new HtmlWebpackPlugin({
      title: 'my-app',
      template: 'public/index.html'
    }),
    //抽离的css文件名
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
   
    new webpack.NamedModulesPlugin()    //当开启 HMR 的时候使用该插件会显示模块的相对路径
  ],
  devServer: {      //虚拟服务器
    hot: false,        //热模块更新作用。即修改或模块后，保存会自动更新 true开启，false关闭
    historyApiFallback: true,         //如果为 true ，页面出错不会弹出 404 页面
    compress: true      //如果为 true ，开启虚拟服务器时，为你的代码进行压缩。加快开发流程和优化的作用
  }
};