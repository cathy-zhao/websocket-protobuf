var WebSocketHandler = {
    send_json(request, responseHandler){
        const ws = new WebSocket('ws://ws.abc.cathy.com:8000/api/quotes/000001');

        ws.onopen = (event) => {
            ws.send(JSON.stringify(request));
        }

        ws.onmessage = (event) => {
            console.log('Message from 服务器', event.data, event);
            responseHandler(JSON.parse(event.data));
        }
    },

    send_protobuf(request, responseHandler){
        const ws = new WebSocket('ws://127.0.0.1:2000');
        ws.onopen = (event) => {
            ws.send(request);
        }

        ws.onmessage = (event) => {
            console.log('Message from 主推服务器', event.data);
            responseHandler(event.data);
        }
    }
}

export default WebSocketHandler;
