<li className="nav-item dropdown">
  <Link to="/#" onClick={e => { e.preventDefault(); this.setState({ <!--@@GROUP-->State: !this.state.<!--@@GROUP-->State }); }} className="nav-link dropdown-toggle arrow-none"  >
    <i className="bx bx-customize mr-2"></i>{this.props.t('<!--@@GROUP_CAPTION-->')} <div className="arrow-down"></div>
  </Link>
  <div className={classname("dropdown-menu", { show: this.state.<!--@@GROUP-->State })} >
<!--@@NAVBAR_PARENT-->
  </div>
</li>
