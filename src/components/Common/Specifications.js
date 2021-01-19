import React, { Component } from 'react';
import { Table } from "reactstrap";

//i18n
import { withNamespaces } from 'react-i18next';
import {Link} from "react-router-dom";

class Specifications extends Component {

  render() {
    if (this.props.file === undefined) {
      return <React.Fragment />;
    }
    return (
      <React.Fragment>
        <div className="mt-2">
          <div className="text-sm-right"><Link to="../apps-attached-files">{this.props.t("Back to File List")}</Link></div>
          <h5 className="mb-3">{this.props.t(this.props.title)} :</h5>

          <div className="table-responsive">
            <Table className="table mb-0 table-bordered">
              <tbody>
              <tr>
                <th scope="row" style={{ width: "35%" }}>{this.props.t("File Name")}</th>
                <td>{this.props.t(this.props.file.name)}</td>
              </tr>
              <tr>
                <th scope="row">{this.props.t("File Size")}</th>
                <td>{this.props.t(this.props.file.fileSize)}</td>
              </tr>
              <tr>
                <th scope="row">{this.props.t("File Type")}</th>
                <td>{this.props.t(this.props.file.type)}</td>
              </tr>
              <tr>
                <th scope="row">{this.props.t("File Created")}</th>
                <td>{this.props.t(this.props.file.created)}</td>
              </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withNamespaces()(Specifications);
