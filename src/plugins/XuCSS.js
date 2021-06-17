
function fixTableThead(){
  let wrapper = document.getElementsByClassName('xu-fix-table-wrapper');
  try {
    for (let i=0;i<wrapper.length;i++){
      let newThead;
      let table = wrapper[i].getElementsByTagName('table')[0];
      let firstThead = table.children[0];
      let oriThead = firstThead.nextElementSibling.tagName !== 'THEAD'?table.children[0]:table.children[1];
      let oriThArr = oriThead.children[0].children;
      if (firstThead.nextElementSibling.tagName !== 'THEAD'){//还没有进行节点克隆
        newThead = firstThead.cloneNode(true);
        table.insertBefore(newThead,firstThead);
      } else {//已经进行了克隆
        newThead = firstThead;
      }
      let cloneThArr = newThead.children[0].children;
      for (let j=0;j<oriThArr.length;j++){
        cloneThArr[j].style.width = window.getComputedStyle(oriThArr[j])['width']
      }
      newThead.style.position = 'absolute';
      newThead.style.top = '0px';
      wrapper[i].addEventListener('scroll',function () {
        newThead.style.top = wrapper[i].scrollTop + 'px';
      });
    }
  } catch (e) {

  }
}

export default {
  fixTableThead
}


