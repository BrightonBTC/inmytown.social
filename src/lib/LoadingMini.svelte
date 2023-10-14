<!-- <div class="spinner-grow spinner-grow-sm text-muted"></div> -->
<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
<style>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 6px;
}
.lds-ellipsis div {
  position: absolute;
  top: 1px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  opacity: .4;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 2px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 2px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 16px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(6px, 0);
  }
}
</style>