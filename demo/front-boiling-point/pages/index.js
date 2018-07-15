import React, { Component } from 'react';
import '@/styles/app.less';
import PubBoilModal from '@/components/pub-boil';
import * as Api from '@/api';
import Tools from '@/components/tools';

// 提取连接
const Linkify = text => text.replace(/\[(.*)\]\((.*)\)/g, '<a href="$2" target="_blank">$1</a>');

// 沸点列表页
export default class BoilsPage extends Component {
    static async getInitialProps({ res }) {
        let user;
        if (res && res.session) {
            user = res.session.user;
        }
        const { data } = await Api.boils();
        return { list: Array.from(data.boils), isLogin: !!user, user }
    }
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            user: props.user || {},
            isLogin: props.isLogin,
        };
        this.pubboilmodal = new PubBoilModal();
    }
    onLogin = async (state, ctx) => {
        const data = await Api.login(state.l_em, state.l_pw);
        if (data.result && !data.error) {
            this.setState({ isLogin: true, user: data.result });
            ctx.close();
        }
    }
    onSign = async (state, ctx) => {
        const data = await Api.sign(state.s_em, state.s_pw, state.s_name);
        if (data.result && !data.error) {
            this.setState({ isLogin: true, user: data.result });
            ctx.close();
        }
    }
    onLogout = async () => {
        const data = await Api.logout();
        if (data.result === true) {
            this.setState({ isLogin: false, user: {} });
        }
    }
    toggleLike = async (bid) => {
        // 判断是增加还是取消
        const list = this.state.list.slice();
        const uid = this.state.user.id;
        const item = list.find(i => i.id === bid);
        if (item.likes.some(i => i === uid)) {
            const { data } = await Api.cancelLike(bid, uid);
            if (data && data.cancelLike) {
                item.likes = item.likes.filter(i => i !== uid);
                this.setState({ list });
            }
        }
        else {
            const { data } = await Api.addLike(bid, uid);
            if (data && data.addLike) {
                item.likes.push(uid);
                this.setState({ list });
            }
        }
    }
    addboil = async () => {
        const user = this.state.user;
        const setState = this.setState.bind(this);
        this.pubboilmodal.open({
            async onSubmit(content, image) {
                const res = await Api.addBoil({
                    content, image, userid: user.id, username: user.name,
                });
                this.close();
                if (res.data && res.data.createBoil) {
                    const { data } = await Api.boils();
                    setState({ list: Array.from(data.boils) })
                }
            }
        });
    }
    removeBoil = async id => {
        const { data } = await Api.removeBoil(id);
        if (data && data.removeBoil) {
            const res = await Api.boils();
            this.setState({ list: Array.from(res.data.boils) });
        }
    }
    editBoil = async item => {
        const user = this.state.user;
        const setState = this.setState.bind(this);
        this.pubboilmodal.open({
            content: item.content,
            image: item.image,
            async onSubmit(content, image) {
                const res = await Api.updateBoil(item.id, content, image);
                this.close();
                if (res.data && res.data.updateBoil) {
                    const { data } = await Api.boils();
                    setState({ list: Array.from(data.boils) })
                }
            }
        });
    }
    render() {
        const { list, user, isLogin } = this.state;

        return (
            <div className="main">
                <div className="bar flex flex-center flex-column">
                    <h2>前端沸点</h2>
                    <h4 style={{ marginTop: 0 }}>每天沸一沸，了解前端事情。</h4>
                </div>
                <Tools
                    user={user}
                    isLogin={isLogin}
                    onPubboil={this.addboil}
                    onLogin={this.onLogin}
                    onSign={this.onSign}
                    onLogout={this.onLogout}
                />
                <ul className="list">{
                    list.map((item, index) => (
                        <li key={`list-${item.id}`} className="list-item flex flex-column">
                            <div className="tool flex flex-ai-center">
                                <div className="flex flex-ai-center flex-full">
                                    <span className="user-name">{item.user.name}</span>
                                    <span className="user-summary">{item.user.summary}</span>
                                </div>
                                <div className="like flex flex-ai-center" onClick={e => this.toggleLike(item.id)}>
                                    {
                                        item.likes.some(i => i === user.id) ?
                                            <img src="/static/like-a.svg" className="a" /> :
                                            <img src="/static/like-b.svg" className="b" />
                                    }
                                    <span className="like-num">{item.likes.length}</span>
                                </div>
                            </div>
                            <div className="flex-full">
                                <div className="content" dangerouslySetInnerHTML={{
                                    __html: Linkify(item.content)
                                }} />
                                <div className="image">
                                    {item.image && <img src={item.image} alt="" />}
                                </div>
                                <div className="time">{item.createdAt}</div>
                            </div>
                            <div className={`sett ${item.user.id === user.id ? 'active' : ''}`}>
                                <span onClick={e => this.editBoil(item)}>编辑</span> | <span onClick={e => this.removeBoil(item.id)}>删除</span>
                            </div>
                        </li>
                    ))
                }
                </ul>
                <button className="more">加载更多</button>
            </div>
        );
    }
}
