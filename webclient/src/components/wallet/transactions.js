import axios from 'axios';
import React, { Component } from 'react';

const TransactionRow = ({data, me})=> {
    if(data.function.name == "setHashStorageId") {
        return (<div>
            <div>
                <div>{data.function.name} on {new Date(data.timestamp*1000).toISOString()}</div>
                <div className="">{data.function.params.id}</div>                
            </div> 
        </div>)
    }
    if(data.function.name == "makeTransfer") {
        return (<div>
            <div>
                <div>{data.function.name} to {data.function.params.to} on {new Date(data.timestamp*1000).toISOString()}</div>
                <div className="">Status: {Number(data.returnData.success)} ({data.returnData.error})</div>                
            </div> 
        </div>)
    }

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