import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ChooseName extends Component {
    constructor(props) {
        super(props)
        this.state = {
          name: '',
          error: null,
          busy: false
        }
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    // check if name is valid
    validate(e) {
        var self = this;
        self.setState({busy: true});
        fetch("http://localhost:8080/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "checkName",
                name: this.state.name
            })
        })
        .then(res=>res.json())
        .then((res)=> {
            console.log("result=", res);
            if (res.result == "0x0000000000000000000000000000000000000000") {
                self.props.handleUpdate({name: self.state.name});
                self.props.history.push("/create/step2");
            } else {
                self.setState({error: "Not found"});
            }
            self.setState({busy: false});
        }).catch((ex)=>{
            self.setState({error: ex});
            self.setState({busy: false});
        })
    }

    render() {
        return (
            <React.Fragment>
                <h2>Choose a name for your wallet</h2>
                <h5 className="mt-4">A short, memorable name makes it easy find your wallet, and share with others.</h5>
                {this.state.error && <div className="row justify-content-md-center mt-4">
                    <div className="alert alert-danger w-50" role="alert">
                        Name is not available!
                    </div>
                </div>}
                <div className="row justify-content-md-center">
                    <div className="mt-4 w-50 input-group">
                        <input type="text" className="form-control" value={this.state.name} onChange={this.handleChange.bind(this)}/>
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">.smartvault.one</span>
                        </div>
                    </div>
                </div>
                {!this.state.busy && <button className="mt-5 btn btn-lg btn-primary" onClick={this.validate.bind(this)}>Next</button>}
                {this.state.busy && <button disabled className="mt-5 btn btn-lg btn-primary">Checking...</button>}
            </React.Fragment>
        );
    }
}

export default withRouter(ChooseName);