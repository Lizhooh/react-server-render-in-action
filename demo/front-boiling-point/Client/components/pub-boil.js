import React, { Component } from 'react';
import ModalContainer from 'react-modal-container';
import '../styles/pub-boil.less';

export default ModalContainer(class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: props.content || '',
            image: props.image || '',
        }
    }

    render() {
        const { onSubmit = _ => _, modal } = this.props;
        const { content, image } = this.state;

        return (
            <div className="pub-boil">
                <div className="box">
                    <div style={{ boxShadow: '1px 2px 2px rgba(1, 1, 1, 0.08)' }}>
                        <textarea placeholder="沸点内容（最多 400 字）" className="input-content" maxLength={400}
                            value={content}
                            onChange={e => this.setState({ content: e.target.value })}
                        />

                        <input type="text" placeholder="配图地址（如果有）" className="input-image"
                            value={image}
                            onChange={e => this.setState({ image: e.target.value })}
                        />
                    </div>
                    <div className="flex">
                        <button className="back" onClick={modal.close}>返回</button>
                        <div className="flex-full"></div>
                        <button className="submit" onClick={e => onSubmit(content, image)}>发布</button>
                    </div>
                </div>
            </div>
        );
    }
})