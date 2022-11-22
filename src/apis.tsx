import { mincu, mincuCore } from "mincu-vanilla";

const isApp = mincuCore.isApp;
const toast = mincu.toast;

const token =
  "passport " +
  (isApp == true
    ? mincu.appData.user.token
    : "");

/**
 * fetch all matches and iNCUers quiz from
 * https://worldcup-api.ncuos.com/api/auth/matches
 */
export async function fetchMatchesAndQuiz() {
  const res = await fetch("https://worldcup-api.ncuos.com/api/auth/matches", {
    headers: {
      Authorization: `${token}`,
    },
  });
  const data = await res.json();
  // console.log(data);
  isApp && toast.info(data.msg);
  return data.data;
}

/**
 * post quiz to
 * https://worldcup-api.ncuos.com/api/auth/quiz
 */
export async function postQuiz(match_id: number, quiz: string) {
  console.log(match_id, quiz);
  const res = await fetch("https://worldcup-api.ncuos.com/api/auth/quiz", {
    method: "POST",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quiz: quiz,
      match_id: match_id,
    }),
  });
  const data = await res.json();
  console.log(data);
  toast.info(data.msg);
  return data.data;
}

/**
 * fetch current matches from
 * https://worldcupjson.net/matches/current
 */
export async function fetchCurrentMatches() {
  const response = await fetch("https://worldcupjson.net/matches/current");
  const data = await response.json();
  // console.log(data);
  return data;
}

/**
 * fetch today matches from
 * https://worldcupjson.net/matches/today
 */
export async function fetchTodayMatches() {
  const response = await fetch("https://worldcupjson.net/matches/today");
  const data = await response.json();
  // console.log(data);
  return data;
}

/**
 * fetch all matches from
 * https://worldcupjson.net/matches
 */
export async function fetchAllMatches() {
  const response = await fetch("https://worldcupjson.net/matches");
  const data = await response.json();
  // console.log(data);
  return data;
}
