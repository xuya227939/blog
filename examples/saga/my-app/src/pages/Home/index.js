import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { Button, InputNumber } from 'antd';
import { add, reduce } from './../../actions/HomeAction';
import './index.css';

class Index extends Component {

  addBtn() {
    const { dispatch } = this.props;
    add(dispatch);
  }

  reduceBtn() {
    const { dispatch } = this.props;
    reduce(dispatch);
  }
  render() {
    const { homeRedu } = this.props;
    return (
      <div className="home">
        <Button type="primary" onClick={this.addBtn.bind(this)} >加</Button>
        <InputNumber style={{ marginLeft: 20 }} value={homeRedu} />
        <Button onClick={this.reduceBtn.bind(this)} style={{ marginLeft: 20 }} >减</Button>
      </div>
    );
  }
}
function mapStateToProps(state,oWnprops) {
  return state;
}
export default connect(mapStateToProps)(Index);