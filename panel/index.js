// panel/index.js, this filename needs to match the one registered in package.json
let packageName = "WechatMiniAppidList";
const Fs = require("fire-fs");
const Path = require("fire-path");
let Electron = require('electron');
// var chokidar = Editor.require('packages://' + packageName + '/node_modules/chokidar');
/**appidList 文件 */
var appidListFile = Editor.Project.path+'/packages'+"/appidList.json";
/**appidName 名称文件 */
var appidNameFile = Editor.Project.path+'/packages'+"/appidName.json";
/**jsonRootFile */
var jsonRootFile = Editor.Project.path+'/packages'+"/jsonRoot.json";
/**isAutoBuild */
var autoBuildFile = Editor.Project.path+'/packages'+"/autoBuild.json";


Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,
  // html template for panel
  template: Fs.readFileSync(
    Editor.url("packages://wechatgame-appid-list/panel/index.html"),
    "utf-8"
  ),
  // element and variable binding
  $: {
    
  },
  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.plugin = new window.Vue({
      el: this.shadowRoot,
      created() {},
      data: {
        /**小游戏跳转文件所在路径文件 */
        jsonRootPath:null,
        /**是否自动编译 */
        isAutoBuild:false,
        appidString1:null,
        appidString2:null,
        appidString3:null,
        appidString4:null,
        appidString5:null,
        appidString6:null,
        appidString7:null,
        appidString8:null,
        appidString9:null,
        appidString10:null,
        appidName1:null,
        appidName2:null,
        appidName3:null,
        appidName4:null,
        appidName5:null,
        appidName6:null,
        appidName7:null,
        appidName8:null,
        appidName9:null,
        appidName10:null,
      },
      methods: {
        /**帮助按钮回调 */
        onBtnClickHelpDoc() {
          let url = "https://github.com/robotPin/cocosCreatorPlugin-WechatMiniAppidList";
          Electron.shell.openExternal(url);
        },
        onBtnClickTellMe() {
          // let data = nodeXlsx.parse(path.join(this.excelRootPath, 'test2.xlsx'));
          // console.log(data);
          // return;
          let url = "http://wpa.qq.com/msgrd?v=3&uin=1067638746&site=qq&menu=yes";
          Electron.shell.openExternal(url);
        },
        /**选择小游戏保存的路径 */
        onBtnClickSelectJsonRootPath() {
          let res = Editor.Dialog.openFile({
              title: "选择微信小游戏下game.json文件的目录",
              defaultPath: Editor.Project.path,
              properties: ['openDirectory'],
          });
          if (res !== -1) {
            let dir = res[0];
            if (dir !== this.jsonRootPath) {
                this.jsonRootPath = dir;
            }
          }
        },
        /**打开小游戏保存的路径 */
        onBtnClickOpenJsonRootPath() {
          if (Fs.existsSync(this.jsonRootPath)) {
              Electron.shell.showItemInFolder(this.jsonRootPath);
              Electron.shell.beep();
          } else {
              Editor.log("目录不存在：" + this.jsonRootPath);
          }
        },
        /**读取APPID文件跟APPID名称文件 */
        _readAppidFile(){
          // Editor.log("_readAppidFile",appidListFile);
          let self = this;
          if (Fs.existsSync(appidListFile)) {
            // Editor.log('文件存在.');
            Fs.readFile(appidListFile, function(err, data) {
              // 读取文件失败/错误
              if (err) {
                  throw err;
              }
              // Editor.log(data.toString());
              let arr = data.toString().split("\n");
              // Editor.log(arr);
              for (let index = 0; index < arr.length; index++) {
                self._setAppid(index,arr[index],true);
              }
            });
          }
          // Editor.log("_readAppidFile",appidNameFile);
          if(Fs.existsSync(appidNameFile)){
            Fs.readFile(appidNameFile, function(err, data) {
              if (err) {
                throw err;
              }
              // Editor.log(data.toString());
              let arr = data.toString().split("\n");
              for (let index = 0; index < arr.length; index++) {
                self._setAppid(index,arr[index],false);
              }
            });
          }
          if(Fs.existsSync(jsonRootFile)){
            Fs.readFile(jsonRootFile, function(err, data) {
              if (err) {
                throw err;
              }
              // Editor.log("read",data.toString());
              self.jsonRootPath=data.toString();
            });
          }
          if(Fs.existsSync(autoBuildFile)){
            Fs.readFile(autoBuildFile, function(err, data) {
              if (err) {
                throw err;
              }
              // Editor.log("isAutoBuild",data.toString());
              if(data.toString()== true || data.toString()== "true"){
                self.isAutoBuild=true;
              }else{
                self.isAutoBuild=false;
              }
            });
          }else{
            self.isAutoBuild=false;
          }
        },
        //读取小游戏列表
        onBtnReadList(){
          this._readAppidFile();
        },
        /**写入文件 */
        onBtnWriteFile(){
          let appidStrs =this.joinStringAppid(this.appidString1,this.appidString2,this.appidString3,this.appidString4,
            this.appidString5,this.appidString6,this.appidString7,this.appidString8,this.appidString9,this.appidString10);
          this._writeFile(appidListFile,appidStrs);
          let nameStrs =this.joinStringName(this.appidName1,this.appidName2,this.appidName3,this.appidName4,this.appidName5,
            this.appidName6,this.appidName7,this.appidName8,this.appidName9,this.appidName10);
          this._writeFile(appidNameFile,nameStrs);
          if(this.isAutoBuild){
            this._writeFile(autoBuildFile,"true");
          }else{
            this._writeFile(autoBuildFile,"false");
          }
        },
        joinStringAppid(){
          let strs="";
          for (let index = 0; index < arguments.length; index++) {
            if(arguments[index] && arguments[index].length>15){
              strs+=arguments[index]+"\n";
            }
          }
          return strs;
        },
        joinStringName(){
          let strs="";
          for (let index = 0; index < arguments.length; index++) {
            if(arguments[index]){
              strs+=arguments[index]+"\n";
            }
          }
          return strs;
        },
        /**把列表跟名称写入文件 */
        _writeFile(fileName,writeStrs){
          // Editor.log(fileName,writeStrs);
            Fs.writeFile(fileName, writeStrs, {flag: 'w'}, function (err) {
              if(err) {
                Editor.error(err);
              } else {
                // Editor.log('写入成功');
              }
            });
        },
        _setAppid(indexNum,appidStr,isAppid){
          if(0==indexNum){
            if(isAppid){
              this.appidString1=appidStr;
            }else{
              this.appidName1=appidStr;
            }
          }else if(1==indexNum){
            if(isAppid){
              this.appidString2=appidStr;
            }else{
              this.appidName2=appidStr;
            }
          }else if(2==indexNum){
            if(isAppid){
              this.appidString3=appidStr;
            }else{
              this.appidName3=appidStr;
            }
          }else if(3==indexNum){
            if(isAppid){
              this.appidString4=appidStr;
            }else{
              this.appidName4=appidStr;
            }
          }else if(4==indexNum){
            if(isAppid){
              this.appidString5=appidStr;
            }else{
              this.appidName5=appidStr;
            }
          }else if(5==indexNum){
            if(isAppid){
              this.appidString6=appidStr;
            }else{
              this.appidName6=appidStr;
            }
          }else if(6==indexNum){
            if(isAppid){
              this.appidString7=appidStr;
            }else{
              this.appidName7=appidStr;
            }
          }else if(7==indexNum){
            if(isAppid){
              this.appidString8=appidStr;
            }else{
              this.appidName8=appidStr;
            }
          }else if(8==indexNum){
            if(isAppid){
              this.appidString9=appidStr;
            }else{
              this.appidName9=appidStr;
            }
          }else if(9==indexNum){
            if(isAppid){
              this.appidString10=appidStr;
            }else{
              this.appidName10=appidStr;
            }
          }
        },
        // 生成配置
        onBtnClickGen() {
          // Editor.Ipc.sendToMain("hello_world:clicked");

          let self =this;
          if(!this.jsonRootPath){
            Editor.log('请选择小游戏列表文件目录');
            return;
          }
          this.onBtnWriteFile();
          Editor.log('开始生成......');
          let filename = this.jsonRootPath+"\\game.json";
          // Editor.log(filename);
          if (Fs.existsSync(filename)) {
            // Editor.log('文件存在，开始替换。');
            Fs.readFile(filename, function(err, data) {
              // 读取文件失败/错误
              if (err) {
                  throw err;
              }
              // 读取文件成功
              // Editor.log("readFile",data.toString());
              let strs = data.toString();
              // Editor.log(strs);
              var fileStrs=strs.substring(0, strs.length-1)+",\"navigateToMiniProgramAppIdList\":[";
              fileStrs += self.stringAddString(self.appidString1,self.appidString2,self.appidString3,self.appidString4,self.appidString5,
                self.appidString6,self.appidString7,self.appidString8,self.appidString9,self.appidString10)
              fileStrs=fileStrs.substring(0, fileStrs.length-1)+"]}";
              // Editor.log("fileStrs",fileStrs);
              Editor.log('开始写入文件......');
              if(fileStrs!=""){
                Fs.writeFile(filename, fileStrs, {flag: 'w'}, function (err) {
                  if(err) {
                    Editor.error(err);
                  } else {
                    Editor.log('小游戏列表写入成功');
                  }
                });
              }
            });
            //写入微信小游戏所在路径跟文件地址
            Fs.writeFile(jsonRootFile, this.jsonRootPath, {flag: 'w'}, function (err) {
              if(err) {
                Editor.error(err);
              } else {
                // Editor.log('写入成功');
              }
            });
          }else{
            Editor.log('请先编译微信小游戏后再生成小游戏列表。');
          }
        },
        stringAddString(){
          let strs="";
          let idLength=0;
          for (let index = 0; index < arguments.length; index++) {
            if(arguments[index] && arguments[index].length>15){
              strs+="\""+arguments[index]+"\",";
            }
          }
          return strs;
        },
        onBtnClickAuto(){
          this.isAutoBuild=!this.isAutoBuild;
          // Editor.log("-----------onBtnClickAuto",this.isAutoBuild);
          if(this.isAutoBuild){
            this._writeFile(autoBuildFile,"true");
          }else{
            this._writeFile(autoBuildFile,"false");
          }
        },
      }
    });

    this.plugin._readAppidFile();
  },

  // register your ipc messages here
  messages: {
    'wechatgame-appid-list:hello' (event) {
      this.$label.innerText = 'Hello!';
    },
    'editor:build-start': function (event, target) {
      if (target.platform === "wechatgame"){
        // Editor.log(" ------------editor:build-start")
        this.plugin._readAppidFile();
      }
    },
    'builder:state-changed': function (event, target) {
      if (target.platform === "wechatgame"){
        // Editor.log(" ------------builder:state-changed")
        this.plugin._readAppidFile();
      }
    },
    // 当插件构建完成的时候触发
    'editor:build-finished': function (event, target) {
      if (target.platform === "wechatgame"){
        //微信编译完成时执行
        // Editor.log(" ------------editor:build-finished")
        if(this.plugin.isAutoBuild){
            this.plugin.onBtnClickGen();
        }
      }
    }
  }
});
