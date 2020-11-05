  <div className="dropdown">
    <Link to="/#" className="dropdown-item dropdown-toggle arrow-none"
          onClick={e => {
            e.preventDefault();
            this.setState({ <!--@@PARENT-->State: !this.state.<!--@@PARENT-->State });
          }}>
      {this.props.t('<!--@@PARENT_CAPTION-->')} <div className="arrow-down"></div>
    </Link>
    <div className={classname("dropdown-menu", { show: this.state.<!--@@PARENT-->State })} >
  <!--@@CHILD-->
    </div>
  </div>
