import { mincu } from "mincu-vanilla";
import { Component } from "solid-js";
import { Spacer4, Spacer2 } from "./widget";
import avatar1 from "/avatar1.png";
import avatar2 from "/avatar2.png";
import avatar3 from "/avatar3.png";

interface Props {
  onclick: () => void;
}
const AwardsExhibition: Component<Props> = (props) => {
  return (
    <>
      <Spacer4 />
      <div class="p-4 rounded-3xl mx-auto bg-gradient-to-br from-[#EDEDED]/20 to-[#9890CD]/30 w-11/12">
        <div class="flex flex-row justify-between items-center">
          <span class="text-lg font-bold">竞猜赢永久头像框</span>
          <span
            class="text-md bg-white/10 px-2 rounded-lg"
            onclick={props.onclick}
          >
            查看已获得
          </span>
        </div>

        <Spacer2 />
        <div class="p-2 flex flex-col justify-around items-center bg-black/10 rounded-xl">
          <div class="text-lg font-semibold">绿茵达人</div>
          <div class="text-gray-200">累计成功竞猜结果场次</div>
          <div class="flex flex-row space-x-10 mt-2">
            <div class="flex flex-col items-center ">
              <img src={avatar1} alt="" class="w-12 h-12 rounded-full" />
              <div class="mt-1 px-1 bg-yellow-500 rounded-xl">初级</div>
              <div class="text-yellow-500">5</div>
            </div>
            <div class="flex flex-col items-center">
              <img src={avatar2} alt="" class="w-12 h-12 rounded-full" />
              <div class="mt-1 px-1 bg-sky-500 rounded-xl">中级</div>
              <div class="text-sky-600">10</div>
            </div>
            <div class="flex flex-col items-center">
              <img src={avatar3} alt="" class="w-12 h-12 rounded-full" />
              <div class="mt-1 px-1 bg-purple-500 rounded-xl">高级</div>
              <div class="text-purple-600">20</div>
            </div>
          </div>
        </div>

        <Spacer2 />
        <div class="p-2 bg-black/10 rounded-xl flex flex-col items-center">
          <div class="text-lg font-semibold">绿茵专家</div>
          <div class="text-gray-200">淘汰赛积分规则：</div>
          <div class="text-gray-200">淘汰赛1分 总决赛2分</div>
          <div class="text-gray-200">积 5 分可领取 iNCU 数字藏品</div>
          <Spacer2 />
          <div
            class="text-white bg-black/80 rounded-full px-3 py-1 shadow-lg"
            onclick={() => {
              mincu.toScreen({
                screen: "Webview",
                params: {
                  url: "https://worldcupnft2022.ncuos.com/?header=false",
                },
              });
            }}
          >
            前往iNCU宇宙
          </div>
          <div class="text-gray-300/60 text-xs mt-1">iNCU--南大家园</div>
        </div>
      </div>
    </>
  );
};

export default AwardsExhibition;
