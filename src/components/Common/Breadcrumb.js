import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";

//i18n
import { withNamespaces } from 'react-i18next';

class Breadcrumbs extends Component {

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">{this.props.t(this.props.breadcrumbItem)}</h4>
              <div className="page-title-right">
                <Breadcrumb listClassName="m-0">
                  <BreadcrumbItem>
                    <Link to="#">{this.props.t(this.props.title)}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>
                    <Link to="#">{this.props.t(this.props.breadcrumbItem)}</Link>
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default withNamespaces()(Breadcrumbs);
