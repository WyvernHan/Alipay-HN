Page({
  data: {
    inputFocus: true,
    bank: '',
    name: '',
  },
  onAutoFocus() {
    this.setData({
      inputFocus: true,
    });
  },
  onExtraTap() {
    my.alert({
      content: 'extra tapped',
    });
  },
  onItemInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },
  onItemFocus() {
    this.setData({
      inputFocus: false,
    });
  },
  onItemBlur() {},
  onItemConfirm() {},
  onClear(e) {
    this.setData({
      [e.target.dataset.field]: '',
    });
  },
  // onPickerTap() {
  //   my.showActionSheet({
  //     title: '选择发卡银行',
  //     items: banks,
  //     success: (res) => {
  //       this.setData({
  //         bank: banks[res.index],
  //       });
  //     },
  //   });
  // },
});