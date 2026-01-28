import request from "@/utils/request";

const prefix = `/business`;

export class DialogueApi {
    static synthesisAudio(testContent) {
        return request({
            url: prefix + "/resource/audio/synthesis-test",
            method: "post",
            data: {
                testContent
            },
            responseType: 'arraybuffer'
        });
    }
}