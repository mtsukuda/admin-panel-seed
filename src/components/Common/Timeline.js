import React, { Component } from "react";
import { Media } from "reactstrap";

//i18n
import { withNamespaces } from 'react-i18next';

class Timeline extends Component {

  render() {
    if (this.props.timeline === undefined) {
      return <React.Fragment />;
    }
    return (
      <React.Fragment>
        <ul className="verti-timeline list-unstyled">
          {
            this.props.timeline.map((line, i) =>
              <li className={(i === 0 ? "event-list active":"event-list")} key={i.toString()}>
                <div className="event-timeline-dot">
                  <i className="bx bx-right-arrow-circle font-size-18"></i>
                </div>
                <Media>
                  <div className="mr-3">
                    <h5 className="font-size-14">{line.date} <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ml-2"></i></h5>
                  </div>
                  <Media body>
                    <div>
                      {line.event}
                    </div>
                  </Media>
                </Media>
              </li>
            )
          }
        </ul>
      </React.Fragment>
    );
  }
}

export default withNamespaces()(Timeline);
