import React, { Component } from 'react'
import './App.css'
import { debounce,compact } from 'lodash'
import * as ReactDataGrid from 'react-data-grid'
import * as axios from 'axios'
import GoogleMapReact from 'google-map-react'
import MyMarker from './Marker'
import {findIndex} from 'lodash'
import phone from './phone.svg'

let App = class extends Component {
  constructor(props, context) {
    super(props, context)
    const columns = [
      { key: 'callnumber', name: 'Call Number', sortable:true, filterable:true },
      { key: 'calldatetime', name: 'Call Date & Time', filterable:true, sortable:true },
      { key: 'priority', name: 'Priority', sortable:true, filterable:true },
      { key: 'district', name: 'District', sortable:true, filterable:true },
      { key: 'description', name: 'Description', sortable:true, filterable:true },
      { key: 'incidentlocation', name: 'Location', sortable:true, filterable:true }];

    this.state = {
      gridHeight: window.innerHeight * 2/3,
      columns: columns,
      rows: [],
      loading: true,
      selectedCallnumber:null,
      center: { lat: 39.2904, lng: -76.6122 },
      zoom:13
    }

    this.params = {
      filters: {},
      sort: 'calldatetime2',
      sortDesc:true
    };

    this.getData()
  }

  handleResize = (e) => {
    this.setState({gridHeight: window.innerHeight * 2/3})
  }
  
  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize)
    this.grid.onToggleFilter();
  }
  
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize)
  }  

  getData = () => {
    var params = {
      ...this.params.filters
    }
    params.orderBy = this.params.sort
    params.orderByDesc = this.params.sortDesc ? true : undefined

    if (this.cancelSource) {
      this.cancelSource.cancel('Canceled by user action')
      this.cancelSource = null
    }

    this.cancelSource = axios.CancelToken.source()
    this.setState({loading:true})

    axios.get('/data', {
      params: params,
      cancelToken: this.cancelSource.token
    })
    .then((response) => {
      this.cancelSource = null
      this.setState({
        rows:response.data,
        loading:false
      })
    })
    .catch((error) =>{
      console.log(error)
    });
  }

  rowGetter = (i) => {
    return this.state.rows[i]
  }

  sort = (col,dir) => {
    if (col === 'calldatetime') {
      col += 2
    }
    this.params = {
      ...this.params,
      sort:col,
      sortDesc: dir === 'DESC'
    }
    this.getData()
  }

  filter = debounce((filter) => {
    this.params.filters = {
      ...this.params.filters,
    }
    this.params.filters[filter.column.key] = filter.filterTerm;
    if (!filter.filterTerm) {
      delete this.params.filters[filter.column.key]
    }
    this.getData()
  },300)

  onCellSelected = ({ rowIdx, idx }) => {
    this.setState({selectedCallnumber:this.state.rows[rowIdx].callnumber})

    var coords = this.getCoordinatesTuple(this.state.rows[rowIdx])
    if (coords) {
      this.setState({
        center:coords
      })
    }    
  };  

  onMarkerClick = (callnumber) => {
    this.setState({
      selectedCallnumber:callnumber,
      //BUG: scrolling to a row is buggy in react-data-grid
      //scrollToRowIndex: findIndex(this.state.rows,{callnumber:callnumber})
    })

    //Using manual DOM code to get around scrollToRowIndex bug
    var idx = findIndex(this.state.rows,{callnumber:callnumber})
    var top = 35 * idx;
    var gridCanvas = this.grid.getDataGridDOMNode().querySelector('.react-grid-Canvas')
    gridCanvas.scrollTop = top
  }

  getCoordinatesTuple = (row) => {
    if (row.location && row.location.endsWith(')') && row.location.indexOf('(') !== -1) {
      var coord = row.location.substring(row.location.lastIndexOf('(') + 1, row.location.length - 1)
      var coords = coord.split(', ');
      if (coords.length === 2) {
        var lat = parseFloat(coords[0])
        var lng = parseFloat(coords[1])
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat,lng]
        }
      }
    }
    return null;    
  }

  render() {

    let Markers = compact(this.state.rows.map(row => {
      var coords = this.getCoordinatesTuple(row);
      if (coords) {
        return <MyMarker key={row.callnumber} callnumber={row.callnumber} lat={coords[0]} lng={coords[1]} onClick={this.onMarkerClick} className={this.state.selectedCallnumber === row.callnumber ? 'selected':''}/>
      }
      return null;
    }))

    return (
      <div className="App">
        { this.state.loading ? <div className="loader"></div> : null }
        <div className="nabisco">
          <img src={phone} className="phone" alt="Phone"/><br/>
          <span className="name">B'more</span><span className="number">911</span>
        </div>

        <div className="bmore-map-wrapper">
          <GoogleMapReact
            center={this.state.center}
            zoom={this.state.zoom}>
            {Markers}
          </GoogleMapReact>         
        </div>

        <div className="bmore-grid-wrapper">
          <ReactDataGrid
            ref={(grid) => { this.grid = grid; }}
            columns={this.state.columns}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            minHeight={this.state.gridHeight}
            onGridSort={this.sort}
            onAddFilter={this.filter}
            enableRowSelect='multi'
            onCellSelected={this.onCellSelected}
            rowSelection={{
              showCheckbox: false,
              enableShiftSelect: false,
              onRowsSelected: this.onRowsSelected,
              onRowsDeselected: this.onRowsDeselected,
              selectBy: {
                keys: {rowKey: 'callnumber', values: [this.state.selectedCallnumber]}
              }
            }}            
            />     
          </div>  
      </div>
    )
  }
}

export default App;
