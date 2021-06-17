
export const notice = function (msg,type) {
  return {
    msg:msg,
    timeOut:2000,
    position:'toast-bottom-center',
    type:type || 'success',
    progressbar: false,
    closeOnHover: false,
  }
};

