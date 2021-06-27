import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
const ethers = require("ethers");
const web3utils = require("web3-utils");

class ChooseName extends Component {
    constructor(props) {
        super(props)
        this.state = {
          name: '',
          error: null,
          busy: false,
          showCost: false
        }
    }

    handleChange(event) {
        this.setState({name: event.target.value, showCost: false});
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
                name: this.state.name + ".crazy.one"
            })
        })
        .then(res=>res.json())
        .then((res)=> {
            console.log("result=", res);
            if (res.result.address == ethers.constants.AddressZero) {
                self.setState({
                    cost: res.result.cost,
                    showCost: true, 
                    error: null
                })
            } else {
                self.setState({error: "Already exists!"});
            }
            self.setState({busy: false});
        }).catch((ex)=>{
            self.setState({error: ex});
            self.setState({busy: false});
        })
    }

    continue(ev) {
        ev.preventDefault();
        this.props.handleUpdate({name: this.state.name, cost: this.state.cost});
        this.props.history.push("/create/step2");
    }
    render() {
        return (
            <React.Fragment>
                <h2>Choose a name for your wallet</h2>
                <h5 className="mt-4">A short, memorable name makes it easy find your wallet, and share with others.</h5>
                <div className="row justify-content-md-center">
                    <div className="mt-4">
                        <form class="form-inline">
                            <div className="form-group mr-3">
                                <input type="text" className="form-control" value={this.state.name} onChange={this.handleChange.bind(this)}/>
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">.crazy.one</span>
                                </div>
                            </div>
                            {!this.state.busy && <button className="btn btn-secondary" onClick={this.validate.bind(this)}>Search</button>}
                            {this.state.busy && <button disabled className="btn btn-secondary">Checking...</button>}
                        </form>
                    </div>
                </div>
                {this.state.error && <div className="row justify-content-md-center mt-4">
                    <div className="alert alert-danger w-50" role="alert">
                        Name is not available!
                    </div>
                </div>}
                
                <p className="mt-3">
                    <a className="" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                        Show Pricing
                    </a>
                </p>
                <div className="collapse" id="collapseExample">
                        <img src="https://miro.medium.com/max/506/1*y_GmTrFyrWG6ZP8o7docUA.png" width="500" className="img-thumbnail"/>
                </div>                
                {this.state.showCost && <div className="mt-4">
                    <div>{this.state.name + ".crazy.one"} is available.</div>                         
                    <div><button className="mt-2 btn btn-lg btn-primary" onClick={this.continue.bind(this)}>Register for {web3utils.fromWei(this.state.cost).split(".")[0]} ONE</button></div>
                </div>}

            </React.Fragment>
        );
    }
}

export default withRouter(ChooseName);