import { mincu } from "mincu-vanilla";
import { Match, Switch } from "solid-js";
import { Divider } from "./widget";

const QuizArea = (props: any) => {
  const { item, quiz, submitQuiz } = props;
  return (
    <>
      {mincu.isApp ? (
        <Switch>
          <Match when={!quiz(item.id) && item.status !== "future_scheduled"}>
            <Divider />
            <div class="text-center text-sm font-semibold text-gray-300">
              未参与竞猜
            </div>
          </Match>

          <Match when={quiz(item.id) && !item.winner}>
            <Divider />
            <div class="text-center">
              已竞猜
              {quiz(item.id) == "Draw" ? "平局" : ` ${quiz(item.id)} 获胜`}
            </div>
          </Match>
          <Match when={quiz(item.id) && item.winner}>
            <Divider />
            <div class="text-center ">
              {item.winner == "Draw" ? "平局" : `${item.winner} 获胜`}{" "}
              {item.winner == quiz(item.id) ? "竞猜正确" : "竞猜错误"}
            </div>
          </Match>

          <Match when={!quiz(item.id) && item.status == "future_scheduled"}>
            <div class="flex flex-row justify-center items-center bg-white/10 w-fit mx-auto px-8 py-2 rounded-full text-sm space-x-6">
              <div
                onclick={() => submitQuiz(item.id, item.home_team?.name!)}
                class="font-semibold"
              >
                主队胜
              </div>
              {item.id <= 48 ? (
                <>
                  <div class="w-px h-6 bg-white/10"></div>
                  <div
                    onclick={() => submitQuiz(item.id, "Draw")}
                    class="font-semibold"
                  >
                    平
                  </div>
                  <div class="w-px h-6 bg-white/10"></div>
                </>
              ) : (
                <div class="">VS</div>
              )}
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
          <div class="text-center ">请在南大家园中打开此页面进行竞猜</div>
        </>
      )}
    </>
  );
};

export default QuizArea;
