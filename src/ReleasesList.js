import React, { Component } from 'react'

class ReleasesList extends Component {

  render () {
    return (
      <ul>
        {this.props.releases.map((release, i) => (
          <li key={i}>
            <h4>{release.basic_information.artists[0].name}</h4>
            <h5>{release.basic_information.title}</h5>
            <img alt={release.basic_information.title} src={release.basic_information.thumb} width="50" height="50" />
          </li>
        ))}
      </ul>
    );
  }

}

export default ReleasesList;
