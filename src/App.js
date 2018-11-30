import React, { Component } from 'react';
import NavBar from './components/NavBar.jsx';
import Queue from './components/Queue.jsx';
import Chat from './components/Chat.jsx'
import ChatBoard from './components/ChatBoard.jsx';
import { Row, Col } from 'antd';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      immediatePrioity:[],
      highPrioity:[],
      mediumPrioity:[],
      lowPrioity:[],
      queueObject: '',
      selectedPrioity:'immediatePrioity',
      selectedQueue: '',
      chattingQueue: [],
      expendChatBoard: false
    }
  }

  handlePrioitySelect = (prioity) => {
    let selectedPrioity;
    if (prioity === '1'){
      selectedPrioity = 'immediatePrioity';
    }
    else if (prioity === '2'){
      selectedPrioity = 'highPrioity';
    }
    else if (prioity === '3'){
      selectedPrioity = 'mediumPrioity';
    }
    else if (prioity === '4'){
      selectedPrioity = 'lowPrioity';
    }
    this.setState({selectedPrioity:selectedPrioity})
  }

  handleChatClick = (queueId) => {
    for(let key in this.state.queueObject){
      if (queueId === key) {
        let selectedQueue = this.state.queueObject[key];
        this.setState({selectedQueue:{...selectedQueue,type: 'startChat', id: key, clientName: selectedQueue.name,counsellorName: 'Dan Karres'}});
        this.state.chattingQueue.push(selectedQueue);
      }
    }
    // this.socket.send(this.state.selectedQueue);
  }

  toggleChatBoard = () => {
    let toggle = !this.state.expendChatBoard;
    this.setState({expendChatBoard: toggle})
  }

  componentDidMount () {

    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onmessage = (data) => {
      const parsedData = JSON.parse(data.data);
      if (parsedData.queue){
        let {queue} = parsedData;
        let lowPrioityArr = [];
        let mediumPrioityArr = [];
        let highPrioityArr = [];
        let immediatePrioityArr = [];

        for(let key in queue){
          if (queue[key].severity >= 1 && queue[key].severity < 25){
            lowPrioityArr.push({...queue[key], id:key})
          }
          else if (queue[key].severity >= 25 && queue[key].severity < 50){
            mediumPrioityArr.push({...queue[key], id:key})
          }
          else if (queue[key].severity >= 50 && queue[key].severity < 75){
            highPrioityArr.push({...queue[key], id:key})
          }
          else if (queue[key].severity >= 75 && queue[key].severity <= 100){
            immediatePrioityArr.push({...queue[key], id:key})
          }
        }

        this.setState({
          immediatePrioity:immediatePrioityArr,
          highPrioity:highPrioityArr,
          mediumPrioity:mediumPrioityArr,
          lowPrioity:lowPrioityArr
        })

        this.setState({queueObject:queue});
      }
    }
  }

  render() {
    const boardGrid = this.state.expendChatBoard ? 4 : 1; 
    return (
      <Row className="App">
        <Col className="navbar" xs={0} sm={0} md={4} lg={4} xl={4}>
          <NavBar Data={this.state} onClick={this.handlePrioitySelect}/>
        </Col>

        <Col className="queue" xs={0} sm={4} md={6} lg={6} xl={6}>
          <Queue 
            Data={this.state}
            selectedPrioity={this.state.selectedPrioity} 
            startChat={this.handleChatClick}
            onPanelClick={this.handlePanelSelect}
          />
        </Col>

        <Col className='chat' xs={24 - boardGrid} sm={20 - boardGrid} md={14 - boardGrid} lg={14 - boardGrid} xl={14 - boardGrid}>
          <Chat clientName={this.state.selectedQueue ? this.state.selectedQueue.name : null}/>
        </Col>

        <Col className='chat-board' span={boardGrid}>
          <ChatBoard 
            expendChatBoard={this.state.expendChatBoard} 
            toggleChatBoard={this.toggleChatBoard}
            chattingQueue={this.state.chattingQueue}
          />
        </Col>  
      </Row>
    );
  }
}

export default App;


