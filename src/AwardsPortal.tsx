import classNames from "classnames";
import copy from "copy-to-clipboard";
import { mincu } from "mincu-vanilla";
import { Component, For, Index, Show } from "solid-js";
import { Portal } from "solid-js/web";
import Loading from "./Loading";
import { Spacer2, Spacer4 } from "./widget";
interface AwardsPortalProps {
  borderData: {
    right_count: number;
    // cd_keys: { title: string; Key: string | null }[];
    borders: { title: string; accepted: boolean }[];
  };
  onAccept: (title: string) => void;
}
const AwardsPortal: Component<AwardsPortalProps> = (props) => {
  if (!props.borderData) {
    mincu.toast.loading("加载中...");
    return;
  }
  const awardsCount = getAwardsCount(props.borderData.right_count);
  return (
    <Portal mount={document.querySelector("body")!}>
      <div class=" fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 max-w-screen-md z-20 w-3/4  bg-white rounded-xl  overflow-hidden p-1 border-2  border-black/30 " >
        <div class="absolute -top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 opacity-70 rounded-full bg-gradient-radial from-[#CC00FF]/30 via-[#FF93DA]/20 to-transparent"></div>
        <div class="bg-white/10 backdrop-blur-2xl  flex flex-col justify-center items-center">
          <div class="p-4 text-3xl">🎉</div>
          <div class="text-2xl font-semibold">
            竞猜正确场次:{props.borderData.right_count}
          </div>
          <Spacer4 />
          <div class="w-11/12 bg-white/20 backdrop-blur-3xl  rounded-xl text-sm font-medium py-1 px-2">
            {props.borderData.right_count < 5 ? (
              <div class="text-center">暂未获得奖品</div>
            ) : (
              <Index each={new Array(awardsCount)}>
                {(_, i) => (
                  <div class="flex flex-row justify-between items-center ">
                    <div class="px-1 py-2 text-center ">
                      已达成：绿茵达人
                      <span
                        class={classNames(
                          "rounded-md px-1 ml-1 text-white",
                          { "bg-yellow-500": i == 0 },
                          { "bg-sky-500": i == 1 },
                          { "bg-purple-500": i == 2 }
                        )}
                      >
                        {classNames(
                          { 初级: i == 0 },
                          { 中级: i == 1 },
                          { 高级: i == 2 }
                        )}
                      </span>
                    </div>
                    <div
                      class={classNames(
                        "text-white px-2 rounded-xl border-2 ",
                        {
                          "bg-gray-300 pointer-events-none":
                            props.borderData.borders[i].accepted,
                        },
                        {
                          "bg-[#404040] shadow-md  border-white/20":
                            !props.borderData.borders[i].accepted,
                        }
                      )}
                      onclick={() => {
                        props.onAccept(props.borderData.borders[i].title);
                      }}
                    >
                      {props.borderData.borders[i].accepted ? "已领取" : "领取"}
                    </div>
                  </div>
                )}
              </Index>
            )}
          </div>
          <div class="text-gray-500 text-xs mt-4 p-1 text-center">
            可点击 我的-头像 更换头像框
            <br />
            *数据更新或稍有延迟
          </div>
        </div>
      </div>
    </Portal>
  );
};

const getAwardsCount = (rightCount: number) => {
  return rightCount < 5 ? 0 : rightCount < 10 ? 1 : rightCount < 20 ? 2 : 3;
};

export default AwardsPortal;
