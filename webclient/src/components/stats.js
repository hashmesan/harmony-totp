import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import {getLocalWallet} from "../config";
import RelayerClient from '../../../lib/relayer_client';
import {CONFIG} from "../config";

class Stats extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    updateData() {
        var self = this;
        var client = new RelayerClient(CONFIG[this.props.environment].API_URL, this.props.environment)
        client.getContractCreated().then(res=>{
            self.setState({result: res.data.result})
        })
    }
    componentDidMount() {
        this.updateData();
    }

    componentDidUpdate(prevProps) {
        if(this.props.environment != prevProps.environment)
        {
            this.updateData();
        }
      } 

    render() {
        console.log(this.props.environment)
        return (
            <div className="container-xl justify-content-md-center">
                <div className="row">
                    <div className="col-12">
                        <h3>Stats</h3> 
                        <table className="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">Factory</th>
                            <th scope="col">Total Wallets</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.result && Object.entries(this.state.result.factories).map(([key, val]) =>{
                                return <tr>
                                <th scope="row">{key}</th>
                                <td>{val.length}</td>
                                </tr>
                            })}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>                    
        );
    }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Stats);