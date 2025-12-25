import request from "@/utils/request";

const prefix = `/business/log`;

export class HistoryApi {
    static listByMonth(data) {
        return request({
            url: prefix + "/conversation/list-by-month",
            method: "post",
            data,
        });
    }

    static detail(id: string) {
        return request({
            url: prefix + "/conversation/detail",
            method: "get",
            params: {
                conversationId: id
            }
        });
    }
    static reaction(data) {
        return request({
            url: prefix + "/conversation/message-like-status-update",
            method: "post",
            data
        });
    }

}