import React, { Component } from "react";
import { CardTitle } from "reactstrap";

//i18n
import { withNamespaces } from 'react-i18next';

class CardTitleKit extends Component {

  render() {
    return (
      <React.Fragment>
        <CardTitle className="mb-5">
          {this.props.t(this.props.cardTitle)}
        </CardTitle>
      </React.Fragment>
    );
  }
}

export default withNamespaces()(CardTitleKit);
