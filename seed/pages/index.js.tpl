import React, { Component } from "react";
import { Container } from "reactstrap";
<!--@@IMPORT_COMPONENTS-->
import Breadcrumbs from '../../components/Common/Breadcrumb';
<!--@@DEFAULT_IMPORT_COMPONENTS-->
//i18n
import { withNamespaces } from 'react-i18next';

class Dashboard extends Component {
<!--@@PAGE_CONSTRUCTOR-->
<!--@@LIFE_CYCLE_METHOD-->
<!--@@FETCH_DATA-->
  render() {
    <!--@@RENDER_FETCHDONE-->
    <!--@@RENDER_BEFORE_RETURN-->
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="<!--@@TITLE_PARENT-->" breadcrumbItem="<!--@@TITLE_CHILD-->" />
            <!--@@PAGE_LAYOUT-->
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
export default withNamespaces()(Dashboard);
