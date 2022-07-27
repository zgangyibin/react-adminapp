import "./loading.scss";
export function showLoading() {
  let divdom = document.createElement("div");
  let loadicon = document.createElement("span");
  divdom.className = "loadingMask";
  loadicon.className = "iconfont icon-jiazai";
  divdom.appendChild(loadicon);
  document.querySelector(".loading").appendChild(divdom);
}

export function hideLoading() {
  let node = document.querySelector(".loadingMask");
  if (node != null) {
    document.querySelector(".loading").removeChild(node);
  }
}
