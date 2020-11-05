import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withNamespaces } from "react-i18next";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.initMenu();
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
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
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{this.props.t("Menu")}</li>
            <li>
              <Link to="/#" className="waves-effect">
                <i className="bx bx-home-circle"></i>
                <span className="badge badge-pill badge-info float-right">
                  03
                </span>
                <span>{this.props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/dashboard">{this.props.t("Default")}</Link>
                </li>
                <li>
                  <Link to="/dashboard1">{this.props.t("Dashboard1")}</Link>
                </li>
                <li>
                  <Link to="/dashboard2">{this.props.t("Dashboard2")}</Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{this.props.t("Apps")}</li>
            <li>
              <Link to="apps-calendar" className=" waves-effect">
                <i className="bx bx-calendar"></i>
                <span>{this.props.t("Calendar")}</span>
              </Link>
            </li>
            <li>
              <Link to="apps-attached-files" className=" waves-effect">
                <i className="bx bx-file-blank"></i>
                <span>{this.props.t("Attached Files")}</span>
              </Link>
            </li>
            <li>
              <Link to="apps-sales" className=" waves-effect">
                <i className="bx bx-bar-chart-alt-2"></i>
                <span>{this.props.t("Sales")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bx-flag"></i>
                <span>{this.props.t("Status")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="apps-status-status-list">
                    {this.props.t("Status List")}
                  </Link>
                </li>
                <li>
                  <Link to="apps-status-status">{this.props.t("Status")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bx-envelope"></i>
                <span>{this.props.t("Email")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="apps-email-inbox">{this.props.t("Inbox")}</Link>
                </li>
                <li>
                  <Link to="apps-email-read">{this.props.t("Read")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bx-store"></i>
                <span>{this.props.t("Ecommerce")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="apps-ecommerce-products">
                    {this.props.t("Products")}
                  </Link>
                </li>
                <li>
                  <Link to="apps-ecommerce-product-detail">
                    {this.props.t("Product Detail")}
                  </Link>
                </li>
                <li>
                  <Link to="apps-ecommerce-orders">
                    {this.props.t("Orders")}
                  </Link>
                </li>
                <li>
                  <Link to="apps-ecommerce-customers">
                    {this.props.t("Customers")}
                  </Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{this.props.t("News")}</li>
            <li>
              <Link to="news-entertainment" className=" waves-effect">
                <i className="bx bx-happy-heart-eyes"></i>
                <span>{this.props.t("Entertainment")}</span>
              </Link>
            </li>
            <li>
              <Link to="news-politics" className=" waves-effect">
                <i className="bx bx-message-square-dots"></i>
                <span>{this.props.t("Politics")}</span>
              </Link>
            </li>
            <li>
              <Link to="news-breaking-news" className=" waves-effect">
                <i className="bx bx-news"></i>
                <span>{this.props.t("Breaking News")}</span>
              </Link>
            </li>

            <li className="menu-title">{this.props.t("Menux")}</li>
            <li>
              <Link to="menux-menuxx" className=" waves-effect">
                <i className="bx bx-receipt"></i>
                <span>{this.props.t("Menuxx")}</span>
              </Link>
            </li>
            <li>
              <Link to="menux-menuxxx" className=" waves-effect">
                <i className="bx bx-briefcase-alt-2"></i>
                <span>{this.props.t("Menuxxx")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bx-map"></i>
                <span>{this.props.t("Maps")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="menux-maps-google-maps">
                    {this.props.t("Google Maps")}
                  </Link>
                </li>
                <li>
                  <Link to="menux-maps-vector-maps">
                    {this.props.t("Vector Maps")}
                  </Link>
                </li>
                <li>
                  <Link to="menux-maps-leaflet-maps">
                    {this.props.t("Leaflet Maps")}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bx-list-ul"></i>
                <span>{this.props.t("Ecommerce")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="menux-ecommerce-products">
                    {this.props.t("Products")}
                  </Link>
                </li>
                <li>
                  <Link to="menux-ecommerce-product-detail">
                    {this.props.t("Product Detail")}
                  </Link>
                </li>
                <li>
                  <Link to="menux-ecommerce-orders">
                    {this.props.t("Orders")}
                  </Link>
                </li>
                <li>
                  <Link to="menux-ecommerce-customers">
                    {this.props.t("Customers")}
                  </Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{this.props.t("Settings")}</li>
            <li>
              <Link to="settings-profile" className=" waves-effect">
                <i className="bx bx-user-circle"></i>
                <span>{this.props.t("Profile")}</span>
              </Link>
            </li>
            <li>
              <Link to="settings-my-wallet" className=" waves-effect">
                <i className="bx bx-user-circle"></i>
                <span>{this.props.t("My Wallet")}</span>
              </Link>
            </li>
            <li>
              <Link to="settings-settings" className=" waves-effect">
                <i className="bx bx-user-circle"></i>
                <span>{this.props.t("Settings")}</span>
              </Link>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withNamespaces()(SidebarContent));
