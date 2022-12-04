import { Component, JSXElement, Show } from "solid-js";
import dayjs from "dayjs";

export type ScoreboardProps = {
  id: number;
  quiz?: string;
  children?: JSXElement;
  status?:
  | "completed"
  | "in_progress"
  | "future_scheduled"
  | "future_unscheduled";
  home_team?: {
    country: string;
    name: string;
    goals: number;
  };
  away_team?: {
    country: string;
    name: string;
    goals: number;
  };
  datetime?: string;
  winner?: string;
  winner_code?: string;
};

export const Scoreboard: Component<ScoreboardProps> = (props) => {
  const {
    children,
    status,
    home_team,
    away_team,
    datetime,
    quiz,
    id,
  } = props;

  dayjs.locale("zh-cn");

  const judgeType = () => {
    if (id < 48) return "小组赛";
    if (id >= 48 && id < 56) return "1 / 8 决赛";
    if (id >= 56 && id < 61) return "1 / 4 决赛";
    if (id === 61 || id === 62) return "半决赛";
    if (id === 63) return "三四名决赛";
    if (id === 64) return "决赛";
  }

  return (
    <div class="flex flex-col p-3 bg-white/10 rounded-2xl">
      {status == "in_progress" ||
        (status == "completed" && (
          <div class=" text-gray-300 text-center">
            {dayjs(datetime).format("MM-DD HH:mm")}
          </div>
        ))}

      <div class="text-center text-grey-300">
        {judgeType()}
      </div>


      <div class="mt-2"></div>
      <div class="flex flex-row justify-around items-center">
        <div class="flex flex-col flex-1 justify-center items-center">
          <Flag country={home_team?.name!} />
          <div class="text-sm whitespace-nowrap">{home_team?.name}</div>
        </div>
        <div class="flex-1">
          <Show
            when={
              status !== "future_scheduled" && status !== "future_unscheduled"
            }
            fallback={
              <div class="flex flex-col flex-nowrap ">
                <div class=" text-gray-200 text-center ">
                  {dayjs(datetime).format("MM-DD")}
                  <br />
                  {dayjs(datetime).format("HH:mm")}
                </div>
              </div>
            }
          >
            <div class="flex flex-col justify-center items-center flex-nowrap">
              <div class="text-4xl font-bold whitespace-normal">
                {props.home_team?.goals || 0} : {props.away_team?.goals || 0}
              </div>
              {status == "in_progress" ? (
                <div class="text-sm text-green-500 font-semibold relative flex felx-row justify-center items-center ">
                  <span class="flex relative h-3 w-3 mr-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  {/* <span class="animate-ping"> ● </span> */}
                  进行中
                </div>
              ) : (
                <div class="text-sm text-gray-300 font-semibold">● 已结束</div>
              )}
            </div>
          </Show>
        </div>
        <div class=" flex flex-col flex-1 justify-center items-center">
          <Flag country={away_team?.name!} />
          <div class="text-sm whitespace-nowrap">{away_team?.name}</div>
        </div>
      </div>
      <div class="mt-2"></div>
      {children}
    </div>
  );
};

const Flag = (props: { country: string }) => {
  const country = props.country === "To Be Determined" ? "待定" : props.country;
  return (
    <img
      class=" h-12 rounded-sm drop-shadow-sm"
      src={`/flags/${country}.webp`.replace(" ", "_")}
      alt=""
    />
  );
};
