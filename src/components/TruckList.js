import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import {SERVER_URL} from '../constants.js';
import AddTruck from './AddTruck.js';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css' 
import {CSVLink} from 'react-csv';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';

class TruckList extends Component {
  constructor(props) {
    super(props);
    this.state = { trucks: [], open: false, message: ''};
  }

  componentDidMount() {
    this.fetchTrucks();
  }
  
  // Fetch all trucks
  fetchTrucks = () => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + 'api/truck', 
    {
      headers: {'Authorization': token}
    })
    .then((response) => response.json()) 
    .then((responseData) => { 
      this.setState({ 
        trucks: responseData._embedded.trucks,
      }); 
    })
    .catch(err => console.error(err));  
  }
  
  confirmDelete = (link) => {
    confirmAlert({
      message: 'Are you sure to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.onDelClick(link)
        },
        {
          label: 'No',
        }
      ]
    })
  }

  // Delete truck
  onDelClick = (link) => {
    const token = sessionStorage.getItem("jwt");
    fetch(link, 
      { 
        method: 'DELETE',
        headers: {'Authorization': token}
      }
    )
    .then(res => {
      this.setState({open: true, message: 'Truck deleted'});
      this.fetchTrucks();
    })
    .catch(err => {
      this.setState({open: true, message: 'Error when deleting'});
      console.error(err)
    }) 
  }
  
  // Add new truck
  addTruck(truck) {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + 'api/truck', 
    {   method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(truck)
    })
    .then(res => this.fetchTrucks())
    .catch(err => console.error(err))
  } 

  // Update truck
  updateTruck(truck, link) {
    const token = sessionStorage.getItem("jwt");
    fetch(link, 
    { method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(truck)
    })
    .then( res =>
      this.setState({open: true, message: 'Changes saved'})
    )
    .catch( err => 
      this.setState({open: true, message: 'Error when saving'})
    )
  }
 
  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.trucks];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ trucks: data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.trucks[cellInfo.index][cellInfo.column.id]
        }}                
      />
    );
  }  

  handleClose = (event, reason) => {
    this.setState({ open: false });
  };

  render() {
    const columns = [{
      Header: 'From',
      accessor: 'fromCity',
      Cell: this.renderEditable
    }, {
      Header: 'To',
      accessor: 'toCity',
      Cell: this.renderEditable
    }, {
      Header: 'Date',
      accessor: 'date',
      Cell: this.renderEditable
    }, {
      Header: 'Truck No',
      accessor: 'truckNo',
      Cell: this.renderEditable
    },{
      id: 'savebutton',
      sortable: false,
      filterable: false,
      width: 100,
      accessor: '_links.self.href',
      Cell: ({value, row}) => (<Button size="small" variant="flat" color="primary" onClick={()=>{this.updateTruck(row, value)}}>Save</Button>)
    }, {
      id: 'delbutton',
      sortable: false,
      filterable: false,
      width: 100,
      accessor: '_links.self.href',
      Cell: ({value}) => (<Button size="small" variant="flat" color="secondary" onClick={()=>{this.confirmDelete(value)}}>Delete</Button>)
    }]

    return (
      <div className="App">
        <Grid container>
          <Grid item>
          <AddTruck addTruck={this.addTruck} fetchTrucks={this.fetchTrucks}/>
          </Grid>
          <Grid item style={{padding: 20}}>
            <CSVLink data={this.state.trucks} separator=";">Export CSV</CSVLink>
          </Grid>
        </Grid>

        <ReactTable data={this.state.trucks} columns={columns} 
          filterable={true} pageSize={10}/>
        <Snackbar           
          open={this.state.open}  onClose={this.handleClose} 
          autoHideDuration={1500} message={this.state.message} />
      </div>
    );
  }
}

export default TruckList;