import axios from 'axios';
import React, { Component, useState, useEffect} from 'react';
const web3utils = require("web3-utils");
import moment from 'moment';
import {getTokenList, getDescription} from "./viper_helper";
import {default_list} from "./token_select";

import { connect } from "redux-zero/react";
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import {CONFIG} from "../../config";

function formatDate(time) {
    return moment(time).fromNow(true);
}

function formatFunction(f) {
    return f.name;
}
const TransactionRow = ({environment, data, me, harmonyClient})=> {
    const [desc, setDesc] = useState(null);
 
    useEffect(()=>{
        const getDesc = async () => {
            if(Array.isArray(data.function)) {
                var desc = await getDescription(data, data.to, harmonyClient)
                setDesc(desc);
            }
        }
        getDesc()
    },null);

    if(!data.function) {
        return (<div className="mb-2">
            <div>
                <div><b>RECEIVED</b> {web3utils.fromWei(data.value)} ONE <span className="float-right">{formatDate(new Date(data.timestamp*1000))}</span></div>
                <div className="">From {data.from}<span className="float-right">Status: {Number(data.returnData.success)}</span></div>                
            </div> 
        </div>)
    }
    if(data.function.name == "setHashStorageId") {
        return (<div className="mb-2">
            <div>
                <div><b>{data.function.name}</b><span className="float-right">{formatDate(new Date(data.timestamp*1000))}</span></div>
                <div className="">{data.function.params.id}<span className="float-right">Status: {Number(data.returnData.success)}</span></div>                
            </div> 
        </div>)
    }
    if(data.function.name == "makeTransfer") {
        return (<div className="mb-2">
            <div>
                <div>{data.function.name} to {data.function.params.to} <span className="float-right">{formatDate(new Date(data.timestamp*1000))}</span></div>
                <div className="">Status: {Number(data.returnData.success)} ({data.returnData.error})</div>                
            </div> 
        </div>)
    } else if (Array.isArray(data.function)) {
        return (<div className="mb-3">
            <div>
                <div><b>{data.function.map(e=>formatFunction(e)).join(" -> ")}</b> <span className="float-right">{formatDate(new Date(data.timestamp*1000))}</span></div>
                <div className="">{desc}&nbsp;<span className="float-right"><small>Status: {Number(data.returnData.success)}</small></span></div>                
            </div> 
        </div>)        

    }
    return null;
}

class Transactions extends Component {
    constructor(props) {
		super(props)
		this.state = {}
	}

    render() {
        //console.log(this.props.data)
        return (
                <div className="card mb-3 mt-3">
                    <div className="card-header">Transactions</div>
                    <div className="card-body text-secondary">
                        {this.props.data && this.props.data.map(e=>{
                            return <TransactionRow data={e} key={e.hash} harmonyClient={this.context.smartvault.harmonyClient} environment={this.props.environment}/>
                        })}   
                    </div>
                </div>
        );
    }
}

Transactions.contextType = SmartVaultContext;

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, null)(Transactions);