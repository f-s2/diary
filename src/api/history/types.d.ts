declare namespace History {
  interface MessageItem {
    id: string;
    conversationId: string;
    // conversationSubject: 0;
    user: string;
    role: number;
    content: any;
    messageTime: string;
    likeStatus: any
  }

  interface ItemType {
    id: string;
    dialogueId: string;
    subject: string;
    initiator: string;
    initiatorName: string;
    initiationTime: string;
    user: string;
    relCommands: number;
    relDevices: number;
    messages: MessageItem[];
  }
}
