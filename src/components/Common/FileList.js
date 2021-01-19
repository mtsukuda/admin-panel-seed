import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, Table } from "reactstrap";

//i18n
import { withNamespaces } from 'react-i18next';

class FileList extends Component {

  render() {
    if (this.props.files === undefined) {
      return <React.Fragment />;
    }
    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <CardTitle className="mb-4">{this.props.t(this.props.listTitle)}</CardTitle>
                <div className="table-responsive">
                  <Table className="table table-nowrap table-centered table-hover mb-0">
                    <tbody>
                    {
                      this.props.files.map((file, i) =>
                        <tr key={"_file_" + i} >
                          <td style={{ width: "45px" }}>
                            <div className="avatar-sm">
                              <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-24">
                                <i className="bx bxs-file-doc"></i>
                              </span>
                            </div>
                          </td>
                          <td>
                            <h5 className="font-size-14 mb-1"><Link to={file.link} className="text-dark">{file.name}</Link></h5>
                            <small>{this.props.t("Size : ")} {file.size}</small>
                          </td>
                          <td>
                            <div className="text-center">
                              <Link to={file.link} className="text-dark"><i className="bx bx-download h3 m-0"></i></Link>
                            </div>
                          </td>
                        </tr>
                      )
                    }
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default withNamespaces()(FileList);
