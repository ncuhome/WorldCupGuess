// World cup
import {
  Component,
  createResource,
  createSignal,
  For,
  Switch,
  Match,
  createEffect,
  onCleanup,
  Show,
  Index,
} from "solid-js";
import dayjs from "dayjs";
import classNames from "classnames";
import { mincu } from "mincu-vanilla";

import {
  acceptBorder,
  fetchAllMatches,
  fetchBorderData,
  fetchCurrentMatches,
  fetchMatchesAndQuiz,
  fetchScore,
  postQuiz,
} from "./apis";
import { Scoreboard, ScoreboardProps } from "./Scoreboard";
import Loading from "./Loading";
import { Spacer2, Spacer4 } from "./widget";
import AwardsPortal from "./AwardsPortal";
import AwardsDiscribe from "./AwardsDiscribe";
import AwardsExhibition from "./AwardsExhibition";
import QuizArea from "./QuizArea";
import { isMock } from "./apis";

//比赛日
const matchDates = [
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 14,
  15, 17, 18,
];

const getValidDate = (date: number): number => {
  return matchDates.includes(date) ? date : getValidDate((date + 1) % 31);
};

const App: Component = () => {
  const [activeDate, setDate] = createSignal(getValidDate(dayjs().date()));
  const [showAwards, setShowAwards] = createSignal(false);
  const [showDiscribe, setShowDiscribe] = createSignal(false);
  const [allMatches] = createResource(fetchAllMatches);
  const [score] = createResource(fetchScore);
  const [matchesAndQuiz, { mutate, refetch: refetchQuiz }] =
    createResource(fetchMatchesAndQuiz);
  const [currentMatches, { refetch }] = createResource(fetchCurrentMatches);
  const [borderData, { mutate: mutateBorderData, refetch: refetchBorderData }] =
    createResource(fetchBorderData);

  let datesContainerRef: HTMLDivElement | undefined;

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

  const handleShowDiscribe = () => {
    if (!mincu.isApp) {
      alert("请在南大家园中打开");
      return;
    }
    setShowDiscribe(true);
  };

  const handleAccept = (title: string) => {
    mutateBorderData({
      ...borderData(),
      borders: borderData()?.borders.map((b) => {
        if (b.title === title) {
          return { ...b, accepted: true };
        }
        return b;
      }),
    } as any);
    acceptBorder(title)
      .then(() => {
        refetchBorderData();
      })
      .catch(() => {
        refetchBorderData();
      });
  };

  if(isMock) setDate(9)
  createEffect(() => {
    if (!datesContainerRef) return;
    activeDate();
    datesContainerRef.scrollLeft =
      (document.querySelector(".activeDate") as HTMLElement)?.offsetLeft -
        176 || 0;
  });

  const timer = setInterval(() => {
    refetch();
  }, 60000);
  onCleanup(() => clearInterval(timer));

  return (
    <>
      <Show when={showAwards()}>
        <div
          class="fixed top-0 left-0 w-screen h-screen z-10 bg-black/30"
          onclick={() => {
            setShowAwards(false);
          }}
        />
        <AwardsPortal borderData={borderData()!} onAccept={handleAccept} />
      </Show>

      <Show when={showDiscribe()}>
        <div
          class="fixed top-0 left-0 w-screen h-screen z-10 bg-black/30"
          onclick={() => {
            setShowDiscribe(false);
          }}
        />
        <AwardsDiscribe score={score().score} />
      </Show>

      <div class="bg-gradient-to-b from-[#7bbd52] to-[#118a06]  text-white min-h-screen font-semibold ">
        <div class="max-w-screen-md mx-auto">
          <div class="flex flex-col">
            {/* 正在进行 */}
            <div class="mt-6"></div>
            <div class="p-4 rounded-3xl mx-auto bg-gradient-to-br from-[#222124] to-[#2B2B2B]/60 w-11/12">
              <Switch fallback={<Loading />}>
                <Match when={currentMatches()?.length > 0}>
                  <div class="flex flex-row justify-between">
                    <div class="text-lg font-bold">正在进行</div>
                    <MoreInfo />
                  </div>
                  <For each={currentMatches()}>
                    {(currentMatch: () => ScoreboardProps, index) => (
                      <>
                        <Spacer2 />
                        <Scoreboard {...currentMatch()} />
                      </>
                    )}
                  </For>
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
            <AwardsExhibition
              clickAwarded={handleShowAwards}
              clickDiscribe={handleShowDiscribe}
            />

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
                      setDate(getValidDate(dayjs().date()));
                    }}
                  >
                    回到今日
                  </span>
                </div>
              </div>
              <Spacer2 />
              <div
                class="flex flex-row space-x-2 overflow-x-auto snap-x scroll-smooth"
                ref={datesContainerRef}
              >
                <Index each={matchDates}>
                  {(item) => (
                    <div
                      class={classNames(
                        "w-10 h-10 rounded-full bg-white/10 text-center leading-10 snap-start flex-shrink-0",
                        {
                          "bg-green-500/90 activeDate": item() === activeDate(),
                        }
                      )}
                      onClick={() => {
                        setDate(item);
                      }}
                    >
                      {item}
                    </div>
                  )}
                </Index>
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
                      <QuizArea
                        item={item}
                        quiz={quiz}
                        submitQuiz={submitQuiz}
                      />
                    </Scoreboard>
                  </>
                )}
              </For>
            </div>
            <Spacer4 />
            <div class="text-center">
              <span
                onclick={() => {
                  window.location.href =
                    "https://wenjuan.feishu.cn/m?t=sWAFWN1vvLHi-wv22";
                }}
                class="px-3 py-1 bg-white/10 text-center rounded-xl"
              >
                问题反馈
              </span>
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
    <div class="text-center">
      <span
        onclick={() => {
          window.open("https://worldcup.cctv.com/");
        }}
        class="px-3 py-1 bg-white/10 text-center rounded-xl"
      >
        更多信息
      </span>
    </div>
  );
};

export default App;
