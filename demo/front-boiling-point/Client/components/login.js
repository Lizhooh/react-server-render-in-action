import React, { Component } from 'react';
import '../styles/login.less';
import ModalContainer from 'react-modal-container';

export default ModalContainer(class extends Component {
    static defaultProps = {
        onLogin: _ => _,
        onSign: _ => _,
    }
    constructor(props) {
        super(props);
        this.state = {
            l_em: 'abc123@qq.com',
            l_pw: 'abc123',
            s_em: '',
            s_pw: '',
            s_name: '',
            flag: false,
        };
    }
    updateValue = (e, key) => {
        this.setState({ [key]: e.target.value });
    }
    renderLoginView = () => (
        <div className="box">
            <h3>登录</h3>
            <div className="flex flex-column from">
                <input type="text" className="input" placeholder="邮箱"
                    value={this.state.l_em}
                    onChange={e => this.updateValue(e, 'l_em')}
                />
                <input type="password" className="input" placeholder="密码"
                    value={this.state.l_pw}
                    onChange={e => this.updateValue(e, 'l_pw')}
                />
            </div>
            <button className="submit" onClick={e => this.props.onLogin(this.state)}>提交</button>
            <div className="footer">
                没有账号？
                <span className="sign-text" onClick={e => this.setState({ flag: true })}>
                    注册
                </span>
            </div>
        </div>
    )
    renderSignView = () => (
        <div className="box" style={{ height: 370 }}>
            <h3>注册</h3>
            <div className="flex flex-column from">
                <input type="text" className="input" placeholder="用户名"
                    value={this.state.s_name}
                    onChange={e => this.updateValue(e, 's_name')}
                />
                <input type="text" className="input" placeholder="邮箱"
                    value={this.state.s_em}
                    onChange={e => this.updateValue(e, 's_em')}
                />
                <input type="password" className="input" placeholder="密码"
                    value={this.state.s_pw}
                    onChange={e => this.updateValue(e, 's_pw')}
                />
            </div>
            <button className="submit" onClick={e => this.props.onSign(this.state)}>提交</button>
            <div className="footer">
                已有账号？
                <span className="sign-text" onClick={e => this.setState({ flag: false })}>
                    登录
                </span>
            </div>
        </div>
    )
    onClose = e => {
        if (e.target === e.currentTarget) {
            this.props.modal.close();
        }
    }
    render() {
        return (
            <div className="login" onClick={this.onClose}>
                {!this.state.flag ? this.renderLoginView() : this.renderSignView()}
            </div>
        );
    }
})
