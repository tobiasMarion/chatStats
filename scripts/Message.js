class Message {
    timestamp
    sender
    content
    type

    constructor(timestamp, sender, content, type) {
        this.timestamp = timestamp
        this.sender = sender
        this.content = content
        this.type = type
    }
}

export default Message
