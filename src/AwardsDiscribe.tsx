import { mincu } from "mincu-vanilla";
import { Component } from "solid-js";
import { Portal } from "solid-js/web";
import { Spacer4 } from "./widget";

interface Props {
    score: number
}

const AwardsDiscribe: Component<Props> = (props) => {
    return (
        <Portal mount={document.querySelector("body")!}>
            <div class=" fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 max-w-screen-md z-20 w-3/4  bg-white rounded-xl  overflow-hidden p-1 border-2  border-black/30 " >
                <div class="absolute -top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 opacity-70 rounded-full bg-gradient-radial from-[#CC00FF]/30 via-[#FF93DA]/20 to-transparent"></div>
                <div class="bg-white/10 backdrop-blur-2xl  flex flex-col justify-center items-center">
                    <div class="p-4 text-3xl">🎁</div>
                    <div class="flex text-xl font-semibold">
                        当前积分:{props.score}
                    </div>
                    <div>积 5 分可领取数字藏品</div>
                    <Spacer4 />
                    <div class="text-l font-semibold text-center text-green-600">
                        以下赛事竞猜正确积 1 分
                    </div>
                    <div class="text-l font-semibold text-center leading-tight">
                        1 / 4 决赛
                        <br />
                        1 / 2 决赛
                        <br />
                        小决赛
                    </div>
                    <Spacer4 />
                    <div class="text-l font-semibold text-center text-green-600">
                        以下赛事竞猜正确积 2 分
                    </div>
                    <div class="text-l font-semibold text-center">
                        决赛
                    </div>

                    <Spacer4 />
                </div>
            </div>
        </Portal >)
}

export default AwardsDiscribe;
