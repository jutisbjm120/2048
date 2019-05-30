var game={
  data:null,//保存游戏的数据:二维数组
  RN:4, CN:4,//总行数和总列数
  //强调: 1. 自己的方法要用自己的属性必须加this.
  //      2. 每个属性和方法间必须用逗号分隔
  start:function(){//启动游戏
    //创建空数组保存在data属性中
    this.data=[];
    //r从0开始到<RN结束
    for(var r=0;r<this.RN;r++){
      //向data中压入一个空数组
      this.data.push([]);
      //c从0开始到<CN结束
      for(var c=0;c<this.CN;c++){
        //将data中r行c列位置赋值为0
        this.data[r][c]=0;
      }
    }
    this.randomNum(); this.randomNum();
    //debugger;//必须开着F12
    //console.dir(this.data);//打桩
    //console.log(this.data.join("\n"));
    this.updateView();
    //为页面绑定键盘按下事件
    //当键盘按下时，自动执行之后的function
    //event事件对象: 当事件发生时自动保存所有事件相关信息的对象
    document.onkeydown=function(e){//event
      switch(e.keyCode){//判断e.keyCode
        //是37: 就左移
        case 37: this.moveLeft(); break;
        //是38: 就上移
        case 38: this.moveUp(); break;
        //是39: 就右移
        case 39: this.moveRight(); break;
        //是40: 就下移
        case 40: this.moveDown(); break;
      }
    }.bind(this);
    //document.onkeydown();
  },
  move:function(callback){//所有移动中相同的代码
    //为data拍照，保存在before中
    var before=String(this.data);
    callback.call(this);
    //为data拍照，保存在after中
    var after=String(this.data);
    if(before!=after){//如果发生了移动
      this.randomNum();//随机生成数
      this.updateView();//更新页面
    }
  },
  moveRight:function(){//右移所有行
    this.move(function(){
      //遍历data中每一行
      for(var r=0;r<this.RN;r++)
        this.moveRightInRow(r);//右移第r行
    }.bind(this));
  },
  moveLeft:function(){//左移所有行
    this.move(function(){
      //遍历data中每一行  r
      for(var r=0;r<this.RN;r++)
        this.moveLeftInRow(r);//左移第r行
    });
  },
  moveUp:function(){
    this.move(function(){
      //遍历data中每一列
      for(var c=0;c<this.CN;c++)
        //调用moveUpInCol上移第c列
        this.moveUpInCol(c);
    });
  },
  moveDown:function(){
    this.move(function(){
      //遍历data中每一列
      for(var c=0;c<this.CN;c++)
        //调用moveDownInCol下移第c列
        this.moveDownInCol(c);
    });
  },
  moveLeftInRow:function(r){
    for(var c=0;c<this.CN-1;c++){
      var nextc=this.getNextInRow(r,c);
      if(nextc==-1){break;}
      else{
        if(this.data[r][c]==0){
          this.data[r][c]=this.data[r][nextc];
          this.data[r][nextc]=0;
          c--;
        }else if(this.data[r][c]
                  ==this.data[r][nextc]){
          this.data[r][c]*=2;
          this.data[r][nextc]=0;//将nextc列置为0 
        }
      }
    }
  },
  moveRightInRow:function(r){//右移第r行
    //c从CN-1开始，到>0结束，反向遍历r行中每个格
    for(var c=this.CN-1;c>0;c--){
      //找r行c列左侧前一个不为0的位置prevc
      var prevc=this.getPrevInRow(r,c);
      //如果prevc为-1,就退出循环
      if(prevc==-1){break;}
      else{//否则
        if(this.data[r][c]==0){//如果c列的值是0
          //将prevc列的值赋值给c列
          this.data[r][c]=this.data[r][prevc];
          //将prevc列的值置为0
          this.data[r][prevc]=0;
          c++;//c留在原地
        }else if(this.data[r][c]
                  ==this.data[r][prevc]){
          //否则 如果c列的值等于prevc列的值
          this.data[r][c]*=2;//将c列的值*2
          this.data[r][prevc]=0;//将prevc列置为0
        }
      }
    }
  },
  moveUpInCol:function(c){
      //r从0开始,到r<RN-1结束，r每次递增1
    for(var r=0;r<this.RN-1;r++){
        //查找r行c列下方下一个不为0的位置nextr
      var nextr=this.getNextInCol(r,c);
      //如果没找到,就退出循环
      if(nextr==-1){break;}
      else{//否则
          //如果r位置c列的值为0
          if(this.data[r][c]==0){
            //将nextr位置c列的值赋值给r位置
            this.data[r][c]=this.data[nextr][c];
            //将nextr位置c列置为0
            this.data[nextr][c]=0;
            r--;//r留在原地
          }else if(this.data[r][c]
                    ==this.data[nextr][c]){
          //否则，如果r位置c列的值等于nextr位置的值          
            //将r位置c列的值*2
            this.data[r][c]*=2;
            //将nextr位置c列的值置为0
            this.data[nextr][c]=0;
          }
      }
    }
  },
  moveDownInCol:function(c){
      //r从RN-1开始，到r>0结束，r每次递减1
    for(var r=this.RN-1;r>0;r--){
      //查找r位置c列上方前一个不为0的位置prevr
      var prevr=this.getPrevInCol(r,c);
      //如果没找到,就退出循环
      if(prevr==-1){break;}
      else{//否则  
        //如果r位置c列的值为0
        if(this.data[r][c]==0){
          //将prevr位置c列的值赋值给r位置
          this.data[r][c]=this.data[prevr][c];
          //将prevr位置c列置为0
          this.data[prevr][c]=0;
          r++;//r留在原地
        }else if(this.data[r][c]
                  ==this.data[prevr][c]){
        //否则，如果r位置c列的值等于prevr位置的值
          this.data[r][c]*=2;//将r位置c列的值*2
          //将prevr位置c列置为0
          this.data[prevr][c]=0;
        }
      }
    }
  },
  getPrevInCol:function(r,c){
    r--;//r-1
    //循环，r到>=0结束，每次递减1
    for(;r>=0;r--){
      //如果r位置c列不等于0, 就返回r
      if(this.data[r][c]!=0) return r;
    }//(遍历结束)
    return -1;//返回-1
  },
  getNextInCol:function(r,c){
    r++;//r+1
    //循环，到<RN结束，r每次递增1
    for(;r<this.RN;r++){
      //如果r位置c列不等于0, 就返回r
      if(this.data[r][c]!=0) return r;
    }//(遍历结束)
    return -1;//返回-1
  },
  //找r行c列左侧前一个不为0的位置
  getPrevInRow:function(r,c){
    c--;//c-1
    //从c开始，到>=0结束，反向遍历
    for(;c>=0;c--){
      //如果r行c位置不是0，就返回c
      if(this.data[r][c]!=0) return c;
    }//(遍历结束)
    return -1;//返回-1
  },
  //找r行c列右侧下一个不为0的位置
  getNextInRow:function(r,c){
    c++;//c+1
    //从c开始，到<CN结束
    for(;c<this.CN;c++){
      //如果r行c位置不是0，就返回c
      if(this.data[r][c]!=0){return c;}
    }//(遍历结束)
    return -1;//返回-1
  },
  //将data中的元素更新到页面对应div中
  updateView:function(){
    //遍历data  r   c
    for(var r=0;r<this.RN;r++)
      for(var c=0;c<this.CN;c++){
        //找到页面中id为cXX的div
        var div=document.getElementById("c"+r+c);
        //如果当前元素不是0
        if(this.data[r][c]!=0){
          //将data中当前元素放入div的内容中
          div.innerHTML=this.data[r][c];
          //修改div的className属性为"cell n"+当前元素值
          div.className="cell n"+this.data[r][c];
        }else{//否则
          div.innerHTML="";//清空div的内容
          //将div的className重置为cell
          div.className="cell";
        }
      }
  },
  //在data的一个随机位置随机生成一个数字
  randomNum:function(){
    while(true){//反复:
      //在0~RN-1之间生成一个随机数r
      var r=Math.floor(Math.random()*this.RN);
      //在0~CN-1之间生成一个随机数c
      var c=Math.floor(Math.random()*this.CN);
      //如果data中r行c列为0
      if(this.data[r][c]==0){
        //将data中r行c列的值设置为: 
          //随机生成一个0~1之间的小数，如果<0.5，就取2，否则取4
        this.data[r][c]=Math.random()<0.6?2:4;
        break;//退出循环
      }
    }
  },
}
game.start();//页面加载后自动启动游戏