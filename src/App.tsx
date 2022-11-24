// World cup
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
  Switch,
  Match,
  onMount,
} from "solid-js";
import dayjs from "dayjs";
import classNames from "classnames";
import { mincu } from "mincu-vanilla";

import avatar1 from "/avatar1.png";
import avatar2 from "/avatar2.png";
import avatar3 from "/avatar3.png";
import {
  fetchAllMatches,
  fetchCurrentMatches,
  fetchMatchesAndQuiz,
  fetchTodayMatches,
  postQuiz,
} from "./apis";
import { Scoreboard, ScoreboardProps } from "./Scoreboard";
import Loading from "./Loading";

const App: Component = () => {
  const [activeDate, setDate] = createSignal(dayjs().date());
  const [allMatches] = createResource(fetchAllMatches);
  const [matchesAndQuiz, { mutate, refetch: refetchQuiz }] =
    createResource(fetchMatchesAndQuiz);
  const [currentMatches, { refetch }] = createResource(fetchCurrentMatches);

  const activeMatches = () => {
    return (allMatches() || []).filter(
      (match: ScoreboardProps) => dayjs(match.datetime).date() === activeDate()
    );
  };

  const nextMatch = () => {
    return allMatches.latest.find(
      (match: ScoreboardProps) => match.status === "future_scheduled"
    );
  };

  const quiz = (match_id: number) => {
    return (matchesAndQuiz()?.matches || []).find(
      (match: ScoreboardProps) => match.id === match_id
    )?.quiz;
  };

  const mutateQuiz = (match_id: number, quiz: string) => {
    mutate({
      ...matchesAndQuiz(),
      matches: (matchesAndQuiz()?.matches || []).map((match: ScoreboardProps) =>
        match.id === match_id ? { ...match, quiz } : match
      ),
    } as any);
  };

  const submitQuiz = (match_id: number, quiz: string) => {
    mutateQuiz(match_id, quiz);
    postQuiz(match_id, quiz).then(() => {
      refetchQuiz();
    });
  };

  setInterval(() => {
    refetch();
  }, 60000);

  return (
    <div class="bg-gradient-to-b from-[#7bbd52] to-[#118a06]  text-white min-h-screen">
      <div class="max-w-screen-md mx-auto">
        <div class="flex flex-col">
          {/* 正在进行 */}
          <div class="mt-6"></div>
          <div class="p-4 rounded-3xl mx-auto bg-gradient-to-br from-[#222124] to-[#2B2B2B]/60 w-11/12">
            <Switch fallback={<Loading />}>
              <Match when={currentMatches()?.length > 0}>
                <div class="text-lg font-bold">正在进行</div>
                <Spacer2 />
                <Scoreboard status="in_progress" {...currentMatches()[0]}>
                  {/*  mmanully track,need to fix */}
                  {currentMatches() ? "" : ""}
                  <MoreInfo />
                </Scoreboard>
              </Match>
              <Match
                when={currentMatches()?.length == 0 && allMatches()?.length > 0}
              >
                <div class="text-lg font-bold">接下来进行</div>
                <Spacer2 />
                <Scoreboard {...nextMatch()}>
                  <MoreInfo />
                </Scoreboard>
              </Match>
            </Switch>
          </div>

          {/* 赢头像框 */}
          <Spacer4 />
          <div class="p-4 rounded-3xl mx-auto bg-gradient-to-br from-[#EDEDED]/20 to-[#9890CD]/30 w-11/12">
            <div class="flex flex-row justify-between items-center">
              <span class="text-lg font-bold">竞猜赢永久头像框</span>
              <span
                class="text-md bg-white/10 px-2 rounded-lg"
                onclick={() => {
                  mincu.isApp
                    ? mincu.toast.info(
                      `竞猜正确次数：${matchesAndQuiz()?.right_count
                      }\n达到对应场次可获得永久头像框`
                    )
                    : alert("请在南大家园中打开");
                }}
              >
                查看已获得
              </span>
            </div>

            <Spacer2 />
            <div class="p-2 flex flex-col justify-around items-center bg-black/10 rounded-xl">
              <div class="text-lg font-semibold">绿茵达人</div>
              <div class="text-gray-300">累计成功竞猜结果场次</div>
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
              <div class="text-gray-300">淘汰赛阶段开启</div>
            </div>
          </div>

          {/* 赛事日程 */}
          <Spacer4 />
          <div class="p-4 rounded-3xl mx-auto bg-gradient-to-br from-[#EDEDED]/20 to-[#9890CD]/30 w-11/12">
            <div class="flex flex-row justify-between">
              <div class="font-bold text-lg">赛事日程</div>
              <div class="py-1 rounded-full text-sm">
                {/* <span class="px-2 text-gray-300">已结束</span> */}
                <span
                  class="bg-green-500 rounded-full py-1 px-2 "
                  onclick={() => {
                    setDate(dayjs().date());
                  }}
                >
                  回到今日
                </span>
              </div>
            </div>
            <Spacer2 />
            <div class="flex flex-row space-x-2 overflow-x-auto scroll-m-0 scroll snap-x">
              <For each={[21, 22, 23, 24, 25, 26, 27, 28, 29, 30]}>
                {(item) => (
                  <div class="flex flex-col items-center snap-center">
                    <div
                      class={classNames(
                        "w-10 h-10 rounded-full bg-white/10 text-center leading-10",
                        { "bg-green-500": item === activeDate() }
                      )}
                      onClick={() => {
                        setDate(item);
                        // refetch();
                      }}
                    >
                      {item}
                    </div>
                  </div>
                )}
              </For>
            </div>

            <For
              each={activeMatches()}
              fallback={
                <>
                  <Spacer2 />
                  <Loading />
                </>
              }
            >
              {(item: ScoreboardProps) => (
                <>
                  <Spacer4 />
                  <Scoreboard {...item}>
                    {mincu.isApp ? (
                      <Switch>
                        <Match
                          when={
                            !quiz(item.id) && item.status !== "future_scheduled"
                          }
                        >
                          <Divider />
                          <div class="text-center text-sm font-semibold text-gray-300">
                            未参与竞猜
                          </div>
                        </Match>

                        <Match when={quiz(item.id) && !item.winner}>
                          <Divider />
                          <div class="text-center">
                            已竞猜
                            {quiz(item.id) == "Draw"
                              ? "平局"
                              : ` ${quiz(item.id)} 获胜`}
                          </div>
                        </Match>
                        <Match when={quiz(item.id) && item.winner}>
                          <Divider />
                          <div class="text-center ">
                            {item.winner == "Draw"
                              ? "平局"
                              : `${item.winner} 获胜`}{" "}
                            {item.winner == quiz(item.id)
                              ? "竞猜正确"
                              : "竞猜错误"}
                          </div>
                        </Match>

                        <Match
                          when={
                            !quiz(item.id) && item.status == "future_scheduled"
                          }
                        >
                          <div class="flex flex-row justify-center items-center bg-white/10 w-fit mx-auto px-8 py-2 rounded-full text-sm space-x-6">
                            <div
                              onclick={() =>
                                submitQuiz(item.id, item.home_team?.name!)
                              }
                              class="font-semibold"
                            >
                              主队胜
                            </div>
                            <div class="w-px h-6 bg-white/10"></div>
                            <div
                              onclick={() => submitQuiz(item.id, "Draw")}
                              class="font-semibold"
                            >
                              平
                            </div>
                            <div class="w-px h-6 bg-white/10"></div>
                            <div
                              onclick={() => {
                                submitQuiz(item.id, item.away_team?.name!);
                              }}
                              class="font-semibold"
                            >
                              客队胜
                            </div>
                          </div>
                        </Match>
                      </Switch>
                    ) : (
                      <>
                        <Divider />
                        <div class="text-center ">
                          请在南大家园中打开此页面进行竞猜
                        </div>
                      </>
                    )}
                  </Scoreboard>
                </>
              )}
            </For>
          </div>
          <Spacer4 />
          <div class=' w-20 py-1 text-center bg-white/10 rounded-xl self-center'
            onClick={() => window.open("https://wenjuan.feishu.cn/m?t=sWAFWN1vvLHi-wv22")}>问题反馈
          </div>
          <Spacer4 />
        </div>
      </div>
    </div >
  );
};

const MoreInfo: Function = () => {
  return (
    <div
      onclick={() => {
        window.open("https://worldcup.cctv.com/");
      }}
      class="p-1 bg-white/10 text-center rounded-lg "
    >
      更多信息
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

export default App;
