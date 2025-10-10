import request from "@/utils/request";

const prefix = `/business`;

export class TaskApi {
    static scanList(data) {
        return request({
            url: prefix + "/task/scan-code-page-list",
            method: "post",
            data,
        });

    }

    static rankingList() {
        return request({
            url: prefix + "/task/rankingList",
            method: "post",
            data: {}
        });
    }
}