import React from 'react'
import ReactDOM from 'react-dom'
import './client.less'
import WebSocketHandler from '../webSocketHandler'
import messages from '../protobuf_pb'
import {Buffer} from 'buffer'
import TFloat from '../js/kmc-tfloat'

class Client extends React.Component{
    constructor(props) {
        super(props)
        this.mysend = this.mysend.bind(this)
        this.encodeDataFrame = this.encodeDataFrame.bind(this)
    }

    state = {
        data: {},
        data2: {},
        Price: '',
        Buy1: '',
        Buy1Qty: '',
        Sale1: '',
        Sale1Qty: '',
        StockCode: '',
        StockName: ''
    }

    componentDidMount(){
        var self = this
        WebSocketHandler.send_json({}, function(data){
            console.log("收到服务器数据", data)
            self.setState({data})
        })
        this.mysend();
    }

    mysend(){
        var self = this;
        var multi_stock_united_req = new messages.multi_stock_united_req()
        var stock_united_req = new messages.stock_united_req()
        var MultiStockUnitedRep = messages.multi_stock_united_rep;

        stock_united_req.setWmarketid(1)
        stock_united_req.setSpszcode('000509')
        stock_united_req.setWtype(0)
        stock_united_req.setFieldsBitmap(65535)
        multi_stock_united_req.setReqsList([stock_united_req])
        var message1 = multi_stock_united_req.serializeBinary();
        console.log("message1", message1);
        var postData = message1; // 二进制块 message1.buffer
        console.log("postData", message1);
        var r = {
            is_subscribe: 0x01,
            req_type: 0x04,
            req_num: 0x0001,
            sub_req_type: 0x04,
            req_len: postData.length,
            req_data: postData
        }

        var reqData = this.encodeDataFrame(r)

        WebSocketHandler.send_protobuf(reqData, function(blob){
            console.log("收到主推服务器数据", blob)
            var reader = new FileReader();
            reader.onload = function(){
                console.log("this.result", this.result);
                var buf = new Buffer(this.result); // ab是转换后的结果
                console.log("buf", buf);
                var msg_type = buf.readInt8(0);
                if(msg_type == 0){
                    var res_type = buf.readInt8(1);
                    var res_num = buf.readInt16BE(2);
                    var sub_res_type = buf.readInt8(4);
                    var sub_res_len = buf.readInt32BE(5);
                    console.log("响应信息：msg_type:", msg_type, "res_type:", res_type, "res_num:", res_num,
            "sub_res_type:", sub_res_type, "sub_res_len:", sub_res_len);

                    const resultChunk = buf.slice(9, 9+sub_res_len);
                    console.log("result", resultChunk);
                    var result = MultiStockUnitedRep.deserializeBinary(new Uint8Array(resultChunk));
                    var RepsList = result.getRepsList();
                    RepsList.map((item) => {
                        var detailsData = item.getDetailsData();
                        var zjcj = TFloat.convert(detailsData.getNzjcj());
                        var Nbjg1 = TFloat.convert(detailsData.getNbjg1()).toFixed(3);
                        var Nsjg1 = TFloat.convert(detailsData.getNsjg1()).toFixed(3);
                        var Nbsl1 = TFloat.convert(detailsData.getNbsl1());
                        var Nssl1 = TFloat.convert(detailsData.getNssl1());
                        var stockCode = detailsData.getStockCode();
                        var data2 = {Buy1: Nbjg1, Buy1Qty: Nbsl1, Sale1: Nsjg1, Sale1Qty: Nssl1, StockCode: stockCode, StockName: detailsData.getStockName()}
                        self.setState({data2})
                        self.setState({
                            Price: zjcj,
                            Buy1: Nbjg1,
                            Buy1Qty: Nbsl1,
                            Sale1: Nsjg1,
                            Sale1Qty: Nssl1,
                            StockCode: stockCode,
                            StockName: detailsData.getStockName()
                        });
                    });
                }else if(msg_type == 1){
                    let subscribe = buf.readInt8(1);
                    let data_len = buf.readInt32BE(2);
                    console.log("主推信息：msg_type:", msg_type, "subscribe:", subscribe, "data_len:", data_len);
                    let resultChunk = buf.slice(6, 6+data_len);
                    console.log("resultChunk:", resultChunk);
                    var result = MultiStockUnitedRep.deserializeBinary(new Uint8Array(resultChunk));
                    var RepsList = result.getRepsList();
                    console.log('RepsList.length', RepsList.length);
                    RepsList.map((item) => {
                        var detailsData = item.getDetailsData();
                        console.log("detailsData", detailsData);
                        if(detailsData){
                            if(detailsData.hasNzjcj()){
                                var zjcj = TFloat.convert(detailsData.getNzjcj()).toFixed(3);
                                self.setState({Price: zjcj});
                            }
                            if(detailsData.hasNbjg1()){
                                var Nbjg1 = TFloat.convert(detailsData.getNbjg1()).toFixed(3);
                                self.setState({Buy1: Nbjg1});
                            }
                            if(detailsData.hasNbsl1()){
                                var Nbsl1 = TFloat.convert(detailsData.getNbsl1());
                                self.setState({Buy1Qty: Nbsl1});
                            }
                            if(detailsData.hasNsjg1()){
                                var Nsjg1 = TFloat.convert(detailsData.getNsjg1()).toFixed(3);
                                self.setState({Sale1: Nsjg1});
                            }
                            if(detailsData.hasNssl1()){
                                var Nssl1 = TFloat.convert(detailsData.getNssl1());
                                self.setState({Sale1Qty: Nssl1});
                            }
                        }
                    });
                }
            }
            reader.readAsArrayBuffer(blob);
        })
    }

    encodeDataFrame(r){
        const buf = Buffer.allocUnsafe(9);
        buf.writeInt8(r.is_subscribe, 0);
        buf.writeInt8(r.req_type, 1);
        buf.writeInt16BE(r.req_num, 2);
        buf.writeInt8(r.sub_req_type, 4);
        buf.writeInt32BE(r.req_len, 5);
        const bufA = Buffer.concat([new Buffer(buf.buffer), new Buffer(r.req_data.buffer)], buf.buffer.byteLength+r.req_data.buffer.byteLength);
        return bufA.buffer;
    }

    render(){
        let data = this.state.data
        let data2 = this.state;
        let fields = [
            {name: '买一', price: data.Buy1, amount: data.Buy1Qty},
            {name: '卖一', price: data.Sale1, amount: data.Sale1Qty}
        ]
        let fields2 = [
            {name: '买一', price: data2.Buy1, amount: data2.Buy1Qty},
            {name: '卖一', price: data2.Sale1, amount: data2.Sale1Qty}
        ]
        return  <div className="client">
                    <div className="title">
                        <label>证券名称</label>
                        <label>{data.StockCode}</label>
                    </div>
                    <div className="content">
                        <div className="left">
                            <label>{data.Price}</label>

                        </div>
                        <div className="fields">
                            {fields.map((item) => <Item {...item}/>)}
                        </div>
                    </div>
                    <div className="title">
                        <label>{this.state.StockName}</label>
                        <label>{this.state.StockCode}</label>
                    </div>
                    <div className="content">
                        <div className="left">
                            <label>{this.state.Price}</label>

                        </div>
                        <div className="fields">
                            {fields2.map((item) => <Item {...item}/>)}
                        </div>
                    </div>
                </div>
    }
}


const Item = (props) => {
    let {name, price, amount} = props
    return  <div className="line">
                <div>{name}</div>
                <div>{price}</div>
                <div>{amount}</div>
            </div>
}

ReactDOM.render(<Client/>, document.getElementById('client'));
