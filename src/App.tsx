// World cup
import {
  Component,
  createResource,
  createSignal,
  For,
  Switch,
  Match,
} from "solid-js";
import dayjs from "dayjs";
import classNames from "classnames";
import { mincu } from "mincu-vanilla";

import {
  fetchAllMatches,
  fetchAwards,
  fetchCurrentMatches,
  fetchMatchesAndQuiz,
  postQuiz,
} from "./apis";
import { Scoreboard, ScoreboardProps } from "./Scoreboard";
import Loading from "./Loading";
import { Spacer2, Spacer4, Divider } from "./widget";
import AwardsPortal from "./AwardsPortal";
import AwardsExhibition from "./AwardsExhibition";

const App: Component = () => {
  const [activeDate, setDate] = createSignal(dayjs().date());
  const [showAwards, setShowAwards] = createSignal(false);
  const [allMatches] = createResource(fetchAllMatches);
  const [matchesAndQuiz, { mutate, refetch: refetchQuiz }] =
    createResource(fetchMatchesAndQuiz);
  const [currentMatches, { refetch }] = createResource(fetchCurrentMatches);
  const [awardsData] = createResource(fetchAwards);

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

  const handleShowAwards = () => {
    if (!mincu.isApp) {
      alert("请在南大家园中打开");
      return;
    }
    setShowAwards(true);
  };

  setInterval(() => {
    refetch();
  }, 60000);

  return (
    <>
      <div
        class={classNames(
          "fixed top-0 left-0 w-screen h-screen  bg-black/30",
          {
            " z-10": showAwards(),
          },
          {
            "-z-10": !showAwards(),
          }
        )}
        id="modal"
        onclick={() => {
          setShowAwards(false);
        }}
      />
      {showAwards() && awardsData() && <AwardsPortal awardsData={matchesAndQuiz()!} />}
      <div class="bg-gradient-to-b from-[#7bbd52] to-[#118a06]  text-white min-h-screen font-semibold">
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
                    <MoreInfo />
                  </Scoreboard>
                </Match>
                <Match
                  when={
                    currentMatches()?.length == 0 && allMatches()?.length > 0
                  }
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
            <AwardsExhibition onclick={handleShowAwards} />

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
                <For each={[21, 22, 23, 24, 25, 26, 27, 28, 29, 30,1,2]}>
                  {(item) => (
                    <div class="flex flex-col items-center snap-center">
                      <div
                        class={classNames(
                          "w-10 h-10 rounded-full bg-white/10 text-center leading-10",
                          { "bg-green-500/90": item === activeDate() }
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
                              !quiz(item.id) &&
                              item.status !== "future_scheduled"
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
                              !quiz(item.id) &&
                              item.status == "future_scheduled"
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
            <div
              class=" w-20 py-1 text-center bg-white/10 rounded-xl self-center"
              onClick={() =>
                (window.location.href =
                  "https://wenjuan.feishu.cn/m?t=sWAFWN1vvLHi-wv22")
              }
            >
              问题反馈
            </div>
            <Spacer4 />
          </div>
        </div>
      </div>
    </>
  );
};

const MoreInfo: Component = () => {
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

export default App;
