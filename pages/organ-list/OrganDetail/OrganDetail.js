Page({
  data: {
    isSq:0
  },
  onLoad(query) {
    var a=JSON.parse(query.lt);
    this.data=a;
    this.data.isSq=query.hi2;
    if(query.hi2=="undefined"){
       this.data.isSq=0;
    }
    console.info(a);
  },
});
