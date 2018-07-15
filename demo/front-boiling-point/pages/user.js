import React, { Component } from 'react';

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [... new Array(1000)].map(i => true),
            listView: null,
        }
        this.state.listView = this.state.list.slice(0, 40).map((item, index) => (
            <li key={index}>{index}</li>
        ));
    }
    componentDidMount() {
        this.setState({
            listView: this.state.list.map((item, index) => (
                <li key={index}>{index}</li>
            ))
        });
    }

    render() {
        return (
            <div>
                <div>Hello</div>
                <ul>{this.state.listView}</ul>
            </div>
        );
    }
}