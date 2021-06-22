import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ChooseName extends Component {
    // check if name is valid
    validate(e) {
        this.props.history.push("/create/step2")
    }
    render() {
        return (
            <React.Fragment>
                <h2>Choose a name for your wallet</h2>
                <h5 className="mt-4">A short, memorable name makes it easy find your wallet, and share with others.</h5>
                <div className="row justify-content-md-center mt-4">
                    <div className="alert alert-danger w-50" role="alert">
                        Name is not available!
                    </div>
                </div>
                <div className="row justify-content-md-center">
                    <div className="mt-4 w-50 input-group">
                        <input type="text" className="form-control"/>
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">.smartvault.one</span>
                        </div>
                    </div>
                </div>
                <button className="mt-5 btn btn-lg btn-primary" onClick={this.validate.bind(this)}>Next</button>                
            </React.Fragment>
        );
    }
}

export default withRouter(ChooseName);