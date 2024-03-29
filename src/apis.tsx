import { mincu, mincuCore, networkModule } from "mincu-vanilla";
import mockData from '../mock.json'

const isApp = mincuCore.isApp;
const toast = mincu.toast;
export const isMock = true
const token = "passport " + (isApp == true ? mincu.appData.user.token : "");

if(isMock) console.log("mock data is used")

interface quizResponse {
  code: number;
  msg: string;
  data: {
    right_count: number;
    matches: {
      id: number;
      quiz: string;
      // venue: string;
      // status: string;
      // home_team_country: string;
      // away_team_country: string;
      // datetime: string;
      winner: string;
      // winner_code: string;
      // home_team_goals: number;
      // away_team_goals: number;
    }[];
  };
}
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
  const data: quizResponse = await res.json();
  // console.log(data);
  // isApp && toast.info(data.msg);
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
  data.code == 0 && toast.info("竞猜成功");
  data.code && toast.info(data.msg);
  return data.data;
}

/**
 * fetch current matches from
 * https://worldcupjson.net/matches/current
 */
export async function fetchCurrentMatches() {
  if(isMock) return mockData.currentMatch
  const response = await fetch("https://worldcupjson.net/matches/current");
  const data = await response.json();
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
  if(isMock) return mockData.allMatches
  const response = await fetch("https://worldcupjson.net/matches");
  const data = await response.json();
  // console.log(data);
  return data;
}

/**
 * fetch awards from
 * https://worldcup-api.ncuos.com/api/auth/keys
 */
export async function fetchAwards() {
  // const response = await fetch("https://worldcup-api.ncuos.com/api/auth/keys",{
  //   headers:{
  //     Authorization: `${token}`,
  //   }
  // });
  // const data = await response.json();

  const data = {
    data: {
      right_count: 10,
      cd_keys: [
        // {
        //   title: "beginner",
        //   Key: "xjp2077",
        // },
        // { title: "intermediate", Key: "JK4CUNN2VWKBNKH" },
        // { title: "advanced", Key: "" },
      ],
    },
  };

  return data.data;
}

interface BorderResponse {
  code: number;
  msg: string;
  data: {
    right_count: number;
    borders: {
      title: string;
      accepted: boolean;
    }[];
  };
}
/**
 * 头像框数据
 * https://worldcup-api.ncuos.com/api/auth/border
 */
export async function fetchBorderData() {
  const response = await fetch(
    "https://worldcup-api.ncuos.com/api/auth/border",
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  const data: BorderResponse = await response.json();

  // const data = {
  //   code: 0,
  //   data: {
  //     borders: [
  //       {
  //         title: "初级",
  //         accepted: true,
  //       },
  //       {
  //         title: "中级",
  //         accepted: false,
  //       },
  //       {
  //         title: "高级",
  //         accepted: false,
  //       },
  //     ],
  //     right_count: 11,
  //   },
  //   msg: "成功",
  // };
  // console.log(data);
  return data.data;
}

/**
 * 领取头像框
 * https://worldcup-api.ncuos.com/api/auth/border
 */
export async function acceptBorder(title: string) {
  const response = await fetch(
    "https://worldcup-api.ncuos.com/api/auth/border",
    {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    }
  );
  const data: BorderResponse = await response.json();
  console.log(data);
  data.code == 0 && toast.info("领取成功");
  data.code && toast.info(data.msg);
  return data.data;
}


/**
 * fetch score from 
 * https://worldcup-api.ncuos.com/api/auth/score
 */
export async function fetchScore() {
  const response = await fetch("https://worldcup-api.ncuos.com/api/auth/score",{
    headers:{
      Authorization: `${token}`,
    }
  });
  const data = await response.json();
  // console.log(data);
  return data.data;
}
