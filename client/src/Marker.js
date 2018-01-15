import React, {Component} from 'react';
import './Marker.css';

export default class MyMarker extends Component {

  onClick = () => {
      this.props.onClick(this.props.callnumber)
  }

  render() {
    return (
       <div className={'marker ' + this.props.className} onClick={this.onClick}>
       </div>
    );
  }
}