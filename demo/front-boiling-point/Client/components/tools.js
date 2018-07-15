import React, { Component } from 'react';
import LoginModal from './login';

export default class Tools extends Component {
    static defaultProps = {
        onPubboil: _ => _,
        onLogin: _ => _,
        onSign: _ => _,
        onLogout: _ => _,
        isLogin: false,
        user: {},
    }
    constructor(props) {
        super(props);
        this.loginmodal = new LoginModal({
            onLogin(state) {
                props.onLogin(state, this);
            },
            onSign(state) {
                props.onSign(state, this);
            }
        });
        this.state = {
            show: false
        };
    }
    componentDidMount() {
        document.addEventListener('click', e => {
            this.state.show && this.setState({ show: false });
        });
    }
    toggle = e => {
        if (!this.props.isLogin) {
            this.loginmodal.open();
        }

        this.setState({ show: !this.state.show });
        e.nativeEvent.stopImmediatePropagation();
    }

    onPubboil = e => {
        if (!this.props.isLogin) {
            return this.loginmodal.open();
        }
        this.props.onPubboil();
    }

    render() {
        const { show } = this.state;
        const { isLogin, user, onLogout } = this.props;

        return (
            <div className="tools flex flex-ai-center" >
                <div className="flex-full">
                    <img src="/static/push.svg" className="push" title="发布沸点" onClick={this.onPubboil} />
                </div>
                <div className="line"></div>
                <div className="user-select">
                    <span className="user" onClick={this.toggle}>
                        {isLogin ? user.name : '登录'}
                    </span>
                    {isLogin &&
                        <div className={`list ${show && 'show'}`}>
                            <div>我的沸点</div>
                            <div onClick={onLogout}>退出</div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}