import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

export default class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            keysword: '',
            hots: [],
            ...props.initState,
        }
    }

    onChange = e => {
        this.setState({ keysword: e.target.value });
        if (e.target.value.length !== 0) {
            const url = 'http://127.0.0.1:3000/autocomplete/' + e.target.value;
            fetch(url).then(res => res.json()).then(res => {
                this.setState({ hots: res });
            });
        }
    }

    render() {
        const { hots, keysword } = this.state;
        return (
            <div className="main">
                <h2 className="title">知乎搜索</h2>
                <section className="flex-center">
                    <div className="input-panel">
                        <input
                            type="text"
                            className="input"
                            placeholder="关键字"
                            onChange={this.onChange}
                            value={keysword}
                        />

                        <div className="hot" style={{ display: keysword.length > 0 ? 'block' : 'none' }}>
                            <ul>
                                {hots.map((item, index) => (
                                    <li key={index} onClick={_ =>
                                        window.open('https://www.zhihu.com/question/' + item.id)
                                    }>
                                        <span>{item.text}</span>
                                        <span>{item.count} 个回答</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <button className="button">搜索</button>
                </section>
            </div>
        );
    }
}
