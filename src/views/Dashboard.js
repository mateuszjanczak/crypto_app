import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import {routes} from "routes";
import Sidebar from "../components/Sidebar";
import CryptoList from "./CryptoList";
import CryptoSingle from "./CryptoSingle";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import Converter from "./Converter";
import Wallet from "./Wallet";
import Settings from "./Settings";
import AuthenticationService from "../service/AuthenticationService";
import icon from "../assets/icon.ico";


class Dashboard extends React.Component {

    state = {
      SSE: null
    };

    componentDidMount() {
        const SSE = new EventSource(`http://localhost:3001/api/notifications/SSE?token=${AuthenticationService.getHeaders()}`);
        this.setState({
            SSE
        });
        Notification.requestPermission();
        SSE.onmessage = function(event) {
            const data = JSON.parse(event.data)[0];
            console.log("New message", data);
            new Notification('Aplikacja do śledzenia kryptowalut', { body: `${data.name} przekroczył ustaloną cenę ${data.value} ${data.currency}. Aktualna cena wynosi ${data.currentPrice}`, icon  });
        };
    }


    componentWillUnmount() {
        const { SSE } = this.state;
        if(SSE.readyState === 1){
            SSE.close();
            console.log("CLOSED")
        }
    }

    render() {
        return (
            <Container>
                <Sidebar/>
                <Switch>
                    <Route exact path={routes.cryptoSingle} component={CryptoSingle}/>
                    <Route exact path={routes.crypto} component={CryptoList}/>
                    <Route exact path={routes.converter} component={Converter}/>
                    <AuthenticatedRoute exact path={routes.wallet} component={Wallet}/>
                    <AuthenticatedRoute exact path={routes.settings} component={Settings}/>
                </Switch>
            </Container>
        )
    }
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 25rem 1fr;
  min-height: 100vh;
`;

export default Dashboard;