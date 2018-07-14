import React from 'react';
import { Button, FormControl, HelpBlock, ControlLabel, FormGroup } from 'react-bootstrap';
import MaskedFormControl from 'react-bootstrap-maskedinput';
import axios from 'axios';

class AddNumbers extends React.Component {

  state = {
    players : [
      {},{},{},{},{},{},{},{},{},{},{},{}
    ]
  }

  componentDidMount() {
    let temp = this.state.players;
    for (let i in temp) {
      temp[i]["show-plus"] = '(+)';
      temp[i]["isDisabled"] = true;
      temp[i]["value"] = "";
    }
    this.setState({ players: temp });
  }

  handleDisable(i) {
    let res = this.state.players[i]["isDisabled"];
    return res;
  }

  handlePlus(i) {
    let res = this.state.players[i]["show-plus"];
    return res;
  }

  handleValue(i) {
    let res = this.state.players[i]['value'];
    return res;
  }

  handlePlusClick(e, i) {
    let temp = this.state.players;
    temp[i]["isDisabled"] = !temp[i]["isDisabled"];
    if (temp[i]["isDisabled"]) { temp[i]["show-plus"] = '(+)'; };
    if (!temp[i]["isDisabled"]) { temp[i]["show-plus"] = '(-)'; };
    this.setState({ players: temp });
  }

  handleChange = (e, i) => {
    e.preventDefault();
    let temp = this.state.players;
    temp[i]["value"] = e.target.value.replace(/\D/g,'');
    temp[i]["value-length"] = temp[i]["value"].length;
    this.setState({ players: temp });
  }

  getValidationState(i) {
    let temp = this.state.players;
    let length = temp[i]["value-length"];
    let checkDisabled = temp[i]["isDisabled"];

    function noDuplicate(index) {
      let temp2 = temp.filter(player =>
        player["isDisabled"] === false &&
        player["value-length"] === 10 ).map(player => player.value);
      return !(temp2.filter(item => item === temp[index]['value']).length > 1);
    }

    if ( length === 10 && !checkDisabled && noDuplicate(i) ) {
      return 'success';
    }
    if ( length === 10 && !checkDisabled && !noDuplicate(i) ) {
      return 'error';
    }
    else if ( length > 0 && !checkDisabled ) return 'error';
  }

  /*handleValue = (index) => {
    if (this.props.dbPlayers[index]) {
      let temp = this.state.players;
      temp[index]["value"] = this.props.dbPlayers[index]['value'];
      temp[index]["value-length"] = temp[index]["value"].length;
      return this.props.dbPlayers[index]['value'];
    }
  }*/

  submitNumbers = (e) => {
    let temp = this.state.players.filter(player =>
      player["isDisabled"] === false &&
      player["value"].length === 10);

      for (let i in temp) {
        temp[i]['acceptedInvite'] = false;
      }

    axios.post('/getnumbers', { temp })
    .then((result) => {
      if (!result.data.success) {
        alert(result.data.error);
      } else {
        alert(result.data.success);
        let temp2 = this.state.players;
        for (let i in temp) {
          temp2[i] = temp[i];
        }
      this.setState({ players: temp2 });


      }
    });
  };

  loadfromDB = () => {
    let temp = this.props.dbPlayers;
    let temp2 = this.state.players;
    for (let i in temp) {
      temp2[i]["value"] = temp[i]["value"];
      temp2[i]["value-length"] = 10;
      temp2[i]["isDisabled"] = false;
    }
    this.setState({ players: temp2 });
  }

  checkAccept = (i) => {
    let res = this.state.players[i]["acceptedInvite"];
    if (res === true) {
      return 'Player has accepted the invite.'
    } else if (res === false) {
      return 'Player has not accepted the invite.'
    }
  }

  render() {
    return (
      <form>
        {this.state.players.map((player, i) => {
          return(
            <FormGroup className="player-box" key={ i }
              controlId="formBasicText"
              validationState={ this.getValidationState(i) }
            >
              <ControlLabel>Player {i+1} <span onClick={ (e) => { this.handlePlusClick(e, i) } }>{this.handlePlus(i)}</span></ControlLabel>
              <MaskedFormControl
                disabled={ this.handleDisable(i) }
                type="text" mask='111-111-1111' value={ this.handleValue(i) }
                placeholder={ i + 1 }
                onChange={ (e) => { this.handleChange(e, i) } }
              />
              <FormControl.Feedback />
              <HelpBlock> { this.checkAccept(i) } </HelpBlock>
            </FormGroup>
          )
        })}
        <p><Button onClick={ (e) => { this.submitNumbers(e) } }>Submit</Button><Button onClick={ (e) => { this.loadfromDB() } }>Load #s from DB</Button></p>
      </form>
    )
  }
}

export default AddNumbers;
