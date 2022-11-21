// World cup
import { Component, For, JSXElement } from "solid-js";
import classnames from "classnames";

import IRAN from "/IRAN.png";
import ENGLAND from "/ENGLAND.png";
import avatar from "/avatar.png";

const App: Component = () => {
  return (
    <div class="bg-gradient-to-b from-[#7bbd52] to-[#118a06]  text-white">
      <div class="max-w-screen-md mx-auto">
        <div class="flex flex-col">
          {/* 正在进行 */}
          <div class="mt-6"></div>
          <div class="p-4 rounded-3xl mx-auto bg-gradient-to-br from-[#222124] to-[#2B2B2B]/60 w-11/12">
            <div class="font-semibold">正在进行</div>
            <Spacer2 />
            <Scoreboard>
              <span class="p-1 bg-white/10 text-center rounded-lg">
                更多信息
              </span>
            </Scoreboard>
          </div>

          {/* 赢头像框 */}
          <Spacer4 />
          <div class="p-4 rounded-3xl mx-auto bg-gradient-to-br from-[#EDEDED]/20 to-[#9890CD]/30 w-11/12">
            <div class="flex flex-row justify-between items-center">
              <span class="text-lg">竞猜赢永久头像框</span>
              <span class="text-md bg-white/10 px-2 rounded-lg">
                查看已获得
              </span>
            </div>

            <Spacer2 />
            <div class="p-2 flex flex-col justify-around items-center bg-black/10 rounded-xl">
              <div class="text-lg font-semibold">绿荫达人</div>
              <div class="text-gray-300">累计成功竞猜结果场次</div>
              <div class="flex flex-row space-x-10 mt-2">
                <div class="flex flex-col items-center ">
                  <img src={avatar} alt="" class="w-10 h-10 rounded-full" />
                  <div class="mt-1 px-1 bg-yellow-500 rounded-xl">初级</div>
                  <div class="text-yellow-500">5</div>
                </div>
                <div class="flex flex-col items-center">
                  <img src={avatar} alt="" class="w-10 h-10 rounded-full" />
                  <div class="mt-1 px-1 bg-sky-500 rounded-xl">中级</div>
                  <div class="text-sky-500">10</div>
                </div>
                <div class="flex flex-col items-center">
                  <img src={avatar} alt="" class="w-10 h-10 rounded-full" />
                  <div class="mt-1 px-1 bg-green-500 rounded-xl">高级</div>
                  <div class="text-green-500">20</div>
                </div>
              </div>
            </div>

            <Spacer2 />
            <div class="p-2 bg-black/10 rounded-xl flex flex-col items-center">
              <div class="font-semibold">绿荫专家</div>
              <div class="text-gray-300">淘汰赛阶段开启</div>
            </div>
          </div>

          {/* 赛事日程 */}
          <Spacer4 />
          <div class="p-4 rounded-3xl mx-auto bg-gradient-to-br from-[#EDEDED]/20 to-[#9890CD]/30 w-11/12">
            <div class="flex flex-row justify-between">
              <div class="font-semibold text-lg">赛事日程</div>
              <div class="py-1  bg-white/10 rounded-full text-sm">
                <span class="px-2">已结束</span>
                <span class="bg-green-500 rounded-full py-1.5 px-2 ">正在竞猜</span>
              </div>
            </div>
            <Spacer2 />
            <div class="flex flex-row space-x-2">
              <For each={[21, 22, 23, 26, 27, 28]}>
                {(item) => (
                  <div class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-white/10 text-center leading-10">
                      {item}
                    </div>
                  </div>
                )}
              </For>
            </div>
            <Spacer2 />
            <Scoreboard >
              <Divider />
              <div class="text-center ">竞猜正确，已竞猜正确6场</div>
            </Scoreboard>
            <Spacer2 />
            <Scoreboard >
              <Divider />
              <div class="text-center ">已竞猜 ENGLAND 胜利</div>
            </Scoreboard>
            <Spacer2 />
            <Scoreboard >
              <div class="flex flex-row justify-center items-center bg-white/10 w-fit mx-auto px-8 py-2 rounded-full text-sm space-x-6">
                  <div class="">左队胜</div>
                  <div class="w-px h-6 bg-white/10"></div>
                  <div>平</div>
                  <div class="w-px h-6 bg-white/10"></div>
                  <div>右队胜</div>
              </div>
            </Scoreboard>
          </div>
        </div>
      </div>
    </div>
  );
};

const Spacer2: Component = () => {
  return <div class="mt-2"></div>;
};

const Spacer4: Component = () => {
  return <div class="mt-4"></div>;
};

const Divider: Component = () => {
  return <div class="h-px bg-white/10 my-1"></div>;
};


const Scoreboard: Component<{ children?: JSXElement }> = ({ children }) => {
  return (
    <div class="flex flex-col p-3 bg-white/10 rounded-2xl ">
      <div class=" text-gray-300 text-center">B group 11/23 21:00</div>
      <div class="mt-2"></div>
      <div class="flex flex-row justify-between">
        <div class="flex flex-col justify-center items-center">
          <img class="w-2/3" src={ENGLAND} alt="" />
          <div>ENGLAND</div>
        </div>
        <div class="flex flex-col justify-center items-center flex-nowrap">
          <div class="text-4xl font-bold whitespace-normal">6:1</div>
          <div class="text-sm text-green-500">●47:32</div>
        </div>
        <div class=" flex flex-col justify-center items-center">
          <img class="w-2/3" src={IRAN} alt="" />
          <div>IRAN</div>
        </div>
      </div>
      <div class="mt-2"></div>
      {children}
    </div>
  );
};

interface CardProps {
  backgroundColor?: string;
  children?: JSXElement;
}
const Card: Component<CardProps> = ({ backgroundColor, children }) => {
  return (
    <div
      class={classnames(
        "rounded-lg shadow-lg overflow-hidden ",
        "bg-" + backgroundColor
      )}
    >
      <div class="px-4 py-5 sm:px-6">{children}</div>
    </div>
  );
};

export default App;
