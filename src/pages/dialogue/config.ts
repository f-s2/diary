/** 百度 AI 的相关配置 */
export const SpeechRecogConfig = {
    APP_ID: "121366898",
    APP_KEY: "Nek66Zg7ycC37rdfcUD0Ppiz",
    SECRET: "Atv0KnnVPFNSVGvuU4rtTaAaVPkh6ltX",
}

export enum WB_Enum {
    /** 语音输入完成 */
    AUDIO_END='AUDIO_END',
    /** 取消语音识别 */
    AUDIO_CANCEL='AUDIO_CANCEL',
    /** 当 AI 流程结束后，后端返回的数据 */
    AI_END='END',
    /** 当 AI 流程开始时使用，目前纯为前端控制 */
    AI_START='START',
    /** 开启全新的对话 */
    NEW_CONVERSATION='NEW_CONVERSATION',
    /** 取消当前的 AI 对话流程 */
    PAUSE_RESPONSE='PAUSE_RESPONSE'
}

/** 当前消息发送的角色 */
export enum MessageTypeEnum {
    User,
    AI
}