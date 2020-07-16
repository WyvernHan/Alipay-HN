Page({
  data: {
    isSq:0
  },
  onLoad(query) {
    const that=this;
    var a=JSON.parse(query.lt);
    that.setData({ 
            ...a
    });
    that.setData({ 
            isSq:query.hi2
    });
    //this.data=a;
    //this.data.isSq=query.hi2;
    if(query.hi2=="undefined"){
      that.setData({ 
            isSq:0
    });
    }
    console.info(a);
  },
});
