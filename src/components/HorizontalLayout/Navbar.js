import React, { Component } from "react";
import { Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";

//i18n
import { withNamespaces } from "react-i18next";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = (item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              <Collapse
                isOpen={this.props.menuOpen}
                className="navbar-collapse"
                id="topnav-menu-content"
              >
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle arrow-none"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ isDashboard: !this.state.isDashboard });
                      }}
                      to="dashboard"
                    >
                      <i className="bx bx-home-circle mr-2"></i>
                      {this.props.t("Dashboard")} {this.props.menuOpen}
                      <div className="arrow-down"></div>
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.isDashboard,
                      })}
                    >
                      <Link to="index" className="dropdown-item">
                        {this.props.t("Default")}
                      </Link>
                      <Link to="Dashboard1" className="dropdown-item">
                        {this.props.t("Dashboard 1")}
                      </Link>
                      <Link to="Dashboard2" className="dropdown-item">
                        {this.props.t("Dashboard 2")}
                      </Link>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      to="/#"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ appsState: !this.state.appsState });
                      }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-customize mr-2"></i>
                      {this.props.t("Apps")} <div className="arrow-down"></div>
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.appsState,
                      })}
                    >
                      <Link to="apps-calendar" className="dropdown-item">
                        {this.props.t("Calendar")}
                      </Link>
                      <Link to="apps-attached-files" className="dropdown-item">
                        {this.props.t("Attached Files")}
                      </Link>
                      <Link to="apps-sales" className="dropdown-item">
                        {this.props.t("Sales")}
                      </Link>
                      <div className="dropdown">
                        <Link
                          to="/#"
                          className="dropdown-item dropdown-toggle arrow-none"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              statusState: !this.state.statusState,
                            });
                          }}
                        >
                          {this.props.t("Status")}{" "}
                          <div className="arrow-down"></div>
                        </Link>
                        <div
                          className={classname("dropdown-menu", {
                            show: this.state.statusState,
                          })}
                        >
                          <Link
                            to="apps-status-status-list"
                            className="dropdown-item"
                          >
                            {this.props.t("Status List")}
                          </Link>
                          <Link
                            to="apps-status-status"
                            className="dropdown-item"
                          >
                            {this.props.t("Status")}
                          </Link>
                        </div>
                      </div>
                      <div className="dropdown">
                        <Link
                          to="/#"
                          className="dropdown-item dropdown-toggle arrow-none"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              emailState: !this.state.emailState,
                            });
                          }}
                        >
                          {this.props.t("Email")}{" "}
                          <div className="arrow-down"></div>
                        </Link>
                        <div
                          className={classname("dropdown-menu", {
                            show: this.state.emailState,
                          })}
                        >
                          <Link to="apps-email-inbox" className="dropdown-item">
                            {this.props.t("Inbox")}
                          </Link>
                          <Link to="apps-email-read" className="dropdown-item">
                            {this.props.t("Read")}
                          </Link>
                        </div>
                      </div>
                      <div className="dropdown">
                        <Link
                          to="/#"
                          className="dropdown-item dropdown-toggle arrow-none"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              ecommerceState: !this.state.ecommerceState,
                            });
                          }}
                        >
                          {this.props.t("Ecommerce")}{" "}
                          <div className="arrow-down"></div>
                        </Link>
                        <div
                          className={classname("dropdown-menu", {
                            show: this.state.ecommerceState,
                          })}
                        >
                          <Link
                            to="apps-ecommerce-products"
                            className="dropdown-item"
                          >
                            {this.props.t("Products")}
                          </Link>
                          <Link
                            to="apps-ecommerce-product-detail"
                            className="dropdown-item"
                          >
                            {this.props.t("Product Detail")}
                          </Link>
                          <Link
                            to="apps-ecommerce-orders"
                            className="dropdown-item"
                          >
                            {this.props.t("Orders")}
                          </Link>
                          <Link
                            to="apps-ecommerce-customers"
                            className="dropdown-item"
                          >
                            {this.props.t("Customers")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      to="/#"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ newsState: !this.state.newsState });
                      }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-customize mr-2"></i>
                      {this.props.t("News")} <div className="arrow-down"></div>
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.newsState,
                      })}
                    >
                      <Link to="news-entertainment" className="dropdown-item">
                        {this.props.t("Entertainment")}
                      </Link>
                      <Link to="news-politics" className="dropdown-item">
                        {this.props.t("Politics")}
                      </Link>
                      <Link to="news-breaking-news" className="dropdown-item">
                        {this.props.t("Breaking News")}
                      </Link>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      to="/#"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ menuxState: !this.state.menuxState });
                      }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-customize mr-2"></i>
                      {this.props.t("Menux")} <div className="arrow-down"></div>
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.menuxState,
                      })}
                    >
                      <Link to="menux-menuxx" className="dropdown-item">
                        {this.props.t("Menuxx")}
                      </Link>
                      <Link to="menux-menuxxx" className="dropdown-item">
                        {this.props.t("Menuxxx")}
                      </Link>
                      <div className="dropdown">
                        <Link
                          to="/#"
                          className="dropdown-item dropdown-toggle arrow-none"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ mapsState: !this.state.mapsState });
                          }}
                        >
                          {this.props.t("Maps")}{" "}
                          <div className="arrow-down"></div>
                        </Link>
                        <div
                          className={classname("dropdown-menu", {
                            show: this.state.mapsState,
                          })}
                        >
                          <Link
                            to="menux-maps-google-maps"
                            className="dropdown-item"
                          >
                            {this.props.t("Google Maps")}
                          </Link>
                          <Link
                            to="menux-maps-vector-maps"
                            className="dropdown-item"
                          >
                            {this.props.t("Vector Maps")}
                          </Link>
                          <Link
                            to="menux-maps-leaflet-maps"
                            className="dropdown-item"
                          >
                            {this.props.t("Leaflet Maps")}
                          </Link>
                        </div>
                      </div>
                      <div className="dropdown">
                        <Link
                          to="/#"
                          className="dropdown-item dropdown-toggle arrow-none"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              ecommerceState: !this.state.ecommerceState,
                            });
                          }}
                        >
                          {this.props.t("Ecommerce")}{" "}
                          <div className="arrow-down"></div>
                        </Link>
                        <div
                          className={classname("dropdown-menu", {
                            show: this.state.ecommerceState,
                          })}
                        >
                          <Link
                            to="menux-ecommerce-products"
                            className="dropdown-item"
                          >
                            {this.props.t("Products")}
                          </Link>
                          <Link
                            to="menux-ecommerce-product-detail"
                            className="dropdown-item"
                          >
                            {this.props.t("Product Detail")}
                          </Link>
                          <Link
                            to="menux-ecommerce-orders"
                            className="dropdown-item"
                          >
                            {this.props.t("Orders")}
                          </Link>
                          <Link
                            to="menux-ecommerce-customers"
                            className="dropdown-item"
                          >
                            {this.props.t("Customers")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      to="/#"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                          settingsState: !this.state.settingsState,
                        });
                      }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-customize mr-2"></i>
                      {this.props.t("Settings")}{" "}
                      <div className="arrow-down"></div>
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.settingsState,
                      })}
                    >
                      <Link to="settings-profile" className="dropdown-item">
                        {this.props.t("Profile")}
                      </Link>
                      <Link to="settings-my-wallet" className="dropdown-item">
                        {this.props.t("My Wallet")}
                      </Link>
                      <Link to="settings-settings" className="dropdown-item">
                        {this.props.t("Settings")}
                      </Link>
                    </div>
                  </li>
                </ul>
              </Collapse>
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withNamespaces()(Navbar));
