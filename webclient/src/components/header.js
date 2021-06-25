import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class Header extends Component {
    render() {
        console.log(this.props);
        
        return (
            <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
                <div className="my-0 mr-md-auto font-weight-normal"><a href="/"><img src="/logo_smartvault.png" height="50"/></a></div>
                {this.props.showCreate? 
                <nav className="my-2 my-md-0 mr-md-3">
                <Link className="p-2 text-dark"  to="/create">Create Wallet</Link>
                <Link className="p-2 text-dark"  to="/restore">Restore Wallet</Link>                  
                </nav>
                :
                <nav className="my-2 my-md-0 mr-md-3">
                    <Link className="p-2 text-dark"  to="/wallet">My Wallet</Link>                    
                </nav>}
            </div>        
        );
    }
}

export default Header;