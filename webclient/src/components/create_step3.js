import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class FirstDeposit extends Component {
    render() {
        return (
            <React.Fragment>
                <h2>YOUR FIRST DEPOSIT</h2>
                <h5 className="mt-4 mb-5">There is a network fee to activate your wallet as it is a smart contract. <br/>This fee will be taken from your first deposit</h5>
                <div className="mt-5">
                    <p><b>Deposit Address:</b>0x123123123123 <a href="#" className="btn btn-link">Show QR Code</a></p>
                    <p><b>Network Fee:</b> 2 ONE</p>

                    <p>Status: Waiting for deposit...</p>

                    <p>
                        YOUR WALLET CONTRACT IS:<br/>
                        0x0123123123 (name)
                    </p>
                    <button className="mt-5 btn btn-lg btn-primary" onClick={this.props.handleSubmit}>Continue</button>                
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(FirstDeposit);