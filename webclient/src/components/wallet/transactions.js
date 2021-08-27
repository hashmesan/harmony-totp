import axios from 'axios';
import React, { Component } from 'react';
const web3utils = require("web3-utils");
import moment from 'moment';

const TransactionRow = ({data, me})=> {
    if(!data.function) {
        return (<div className="mb-2">
            <div>
                <div><b>RECEIVED</b> {web3utils.fromWei(data.value)} ONE <span className="float-right">{moment(new Date(data.timestamp*1000)).fromNow(true)}</span></div>
                <div className="">From {data.from}<span className="float-right">Status: {Number(data.returnData.success)}</span></div>                
            </div> 
        </div>)
    }
    if(data.function.name == "setHashStorageId") {
        return (<div className="mb-2">
            <div>
                <div><b>{data.function.name}</b><span className="float-right">{moment(new Date(data.timestamp*1000)).fromNow(true)}</span></div>
                <div className="">{data.function.params.id}<span className="float-right">Status: {Number(data.returnData.success)}</span></div>                
            </div> 
        </div>)
    }
    if(data.function.name == "makeTransfer") {
        return (<div className="mb-2">
            <div>
                <div>{data.function.name} to {data.function.params.to} <span className="float-right">{moment(new Date(data.timestamp*1000)).fromNow(true)}</span></div>
                <div className="">Status: {Number(data.returnData.success)} ({data.returnData.error})</div>                
            </div> 
        </div>)
    } else {
        return (<div className="mb-2">
            <div>
                <div><b>{data.function.name}</b> <span className="float-right">{moment(new Date(data.timestamp*1000)).fromNow(true)}</span></div>
                <div className="">&nbsp;<span className="float-right">Status: {Number(data.returnData.success)}</span></div>                
            </div> 
        </div>)        
    }

    console.log(data)

    return null;
}

class Transactions extends Component {
    render() {
        //console.log(this.props.data)
        return (
                <div className="card mb-3 mt-3">
                    <div className="card-header">Transactions</div>
                    <div className="card-body text-secondary">
                        {this.props.data && this.props.data.map(e=>{
                            return <TransactionRow data={e} key={e.hash}/>
                        })}   
                    </div>
                </div>
        );
    }
}

export default Transactions;