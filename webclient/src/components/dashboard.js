import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

  class Dashboard extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {

      return (
        <div>
          hello world
        </div>
      );
    }
  } 

//const mapToProps = ({ environment }) => ({ environment });
//export default connect(mapToProps, actions)(withRouter(Dashboard));
export default Dashboard;