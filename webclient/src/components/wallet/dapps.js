import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import {getLocalWallet} from "../../config";
import RelayerClient from '../../../../lib/relayer_client';
import {CONFIG} from "../../config";

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
            <div className="card mb-3">
                <div className="card-header">Dapps</div>
                <div className="card-body text-secondary p-5">
                    <div className="row row-cols-1 row-cols-md-3">
                        <div className="card">
                            <div className="bg-light p-4"><img src="https://viper.exchange/static/media/black.2658c4b3.svg" className="card-img-top" alt="..."/></div>
                            <div className="card-body text-secondary text-center">
                                <h5 class="card-title">ViperSwap</h5>
                                <Link to="/wallet/viper" class="btn btn-primary">Launch</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Stats);