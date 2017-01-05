import { connect } from 'react-redux';
import Home from '../components/home';
import { clickNode } from '../actions';

function mapStateToProps(state) {
  return {
    title: state.workflow.title,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clickNode(node) {
      dispatch(clickNode(node));
    },
  };
}

const HomeRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default HomeRoot;
