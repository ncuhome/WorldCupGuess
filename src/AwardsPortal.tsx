import classNames from "classnames";
import copy from "copy-to-clipboard";
import { mincu } from "mincu-vanilla";
import { Component, Index } from "solid-js";
import { Portal } from "solid-js/web";
import Loading from "./Loading";
import { Spacer2, Spacer4 } from "./widget";
interface AwardsPortalProps {
  awardsData: {
    right_count: number;
    cd_keys: { title: string; cd_key: string | null }[];
  };
}
const AwardsPortal: Component<AwardsPortalProps> = (props) => {
  return (
    <Portal mount={document.querySelector("body")!}>
      <div class=" fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 max-w-screen-md z-20 w-3/4  bg-white rounded-xl  overflow-hidden p-1 border-2  border-black/30 ">
        <div class="absolute -top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 opacity-70 rounded-full bg-gradient-radial from-[#CC00FF]/20 via-[#FF93DA]/20 to-transparent"></div>
        <div class="bg-white/10 backdrop-blur-2xl  flex flex-col justify-center items-center">
          <div class="p-4 text-3xl">🎉</div>
          <div class="text-2xl font-semibold">
            竞猜正确场次:{props.awardsData.right_count}
          </div>
          <Spacer4 />
          <div class="w-11/12 bg-white/20  rounded-xl text-sm py-1 px-2">
            {props.awardsData.right_count < 5 ? (
              <div class="text-center">暂未获得奖品</div>
            ) : (
              <Index each={props.awardsData.cd_keys}>
                {(award, i) =>
                  award().cd_key && (
                    <div>
                      <div class="py-2">
                        已获得：绿茵达人
                        <span
                          class={classNames(
                            "rounded-md px-1 ml-1 text-white",
                            { "bg-yellow-500": award().title == "初级" },
                            { "bg-sky-500": award().title == "中级" },
                            { "bg-purple-500": award().title == "高级" }
                          )}
                        >
                          {award().title}
                        </span>
                        <div
                          class="flex flex-row justify-between"
                          onclick={() => {
                            copy(award().cd_key!, {
                              debug: true,
                            });
                            mincu.toast.success("复制成功,请前往神秘商店兑换");
                          }}
                        >
                          <span>兑换码：{award().cd_key}</span>
                          <img src="/copy.png" class="h-5" onclick={() => {}} />
                        </div>
                      </div>

                      {i !== 2 && props.awardsData.cd_keys[i + 1].cd_key && (
                        <div class="h-px bg-black/10 m-1" />
                      )}
                    </div>
                  )
                }
              </Index>
            )}
          </div>
          <div class="text-gray-500 text-xs mt-4 p-1">*数据更新或稍有延迟</div>
        </div>
      </div>
    </Portal>
  );
};

export default AwardsPortal;
