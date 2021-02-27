import React from 'react';
import SkyLight from 'react-skylight';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class AddTruck extends React.Component {
  constructor(props) {
      super(props);
      this.state = {fromCity: '', toCity: '',  truckNo: '', date: ''};
  }

  handleChange = (event) => {
      this.setState(
          {[event.target.name]: event.target.value}
      );
  }    
  
  // Save truck and close modal form
  handleSubmit = (event) => {
      event.preventDefault();
      var newTruck = {fromCity: this.state.fromCity, toCity: this.state.toCity, 
        truckNo: this.state.truckNo, date: this.state.date};
      this.props.addTruck(newTruck);    
      this.refs.addDialog.hide();    
  }

  cancelSubmit = (event) => {
    event.preventDefault();    
    this.refs.addDialog.hide();    
  }
  
  render() {
    return (
      <div>
        <SkyLight hideOnOverlayClicked ref="addDialog">
          <h3>New truck</h3>
          <form>
            <TextField label="From City" placeholder="FromCity"  name="fromCity" onChange={this.handleChange}/><br/>
            <TextField label="To City" placeholder="ToCity" name="toCity" onChange={this.handleChange}/><br/>
            <TextField label="Truck No" placeholder="truckNo" name="truckNo" onChange={this.handleChange}/><br/>
            <TextField label="Date" placeholder="Date" name="date" onChange={this.handleChange}/><br/>
            <Button variant="outlined" style={{marginRight: 10}} color="primary" onClick={this.handleSubmit}>Save</Button>        
            <Button variant="outlined" color="secondary" onClick={this.cancelSubmit}>Cancel</Button>        
          </form>     
        </SkyLight>
        <div>
            <Button variant="raised" color="primary" style={{'margin': '10px'}} onClick={() => this.refs.addDialog.show()}>New Truck</Button>
        </div>
      </div>   
    );
  }
}

export default AddTruck;