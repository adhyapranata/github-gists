import React, {Component} from 'react';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
import marked from 'marked';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    state = {
        gists: null
    }

    componentDidMount() {
        fetch('https://api.github.com/users/todiadiyatmo/gists')
            .then(response => response.json())
            .then(gists => this.setState({gists}))
    }

    render() {
        const {gists} = this.state
        return (
            <Router>
                <Root a="a" b="b">
                    <Sidebar>
                        <NavLink exact activeClassName="active" to="/">
                            <SidebarItem>Home</SidebarItem>
                        </NavLink>
                        {gists ? (
                            gists.map((gist) => (
                                <NavLink key={gist.id} activeClassName="active" to={`/g/${gist.id}`}>
                                    <SidebarItem>{gist.description || '[no description]'}</SidebarItem>
                                </NavLink>
                            ))
                        ) : (
                            <Loading/>
                        )}
                    </Sidebar>
                    <Main>
                        <Route exact path="/" render={() => (
                            <div className="App">
                                <header className="App-header">
                                    <img src={logo} className="App-logo" alt="logo"/>
                                    <h1 className="App-title">Welcome to React</h1>
                                </header>
                                <p className="App-intro">
                                    To get started, edit <code>src/App.js</code> and save to reload. </p>
                            </div>
                        )}/>
                        {
                            gists && (
                                <Route path="/g/:gistId" render={({match}) => (
                                    <Gist gist={gists.find(g => g.id === match.params.gistId)}/>
                                )}/>
                            )
                        }
                    </Main>
                </Root>
            </Router>
        );
    }
}

const Gist = ({gist}) => {
    return (
        <div>
            <h1>{gist.description || 'No Description'}</h1>
            <ul>
                {Object.keys(gist.files).map(key => (
                    <li key={key}>
                        <b>{key}</b>
                        <LoadFile url={gist.files[key].raw_url}></LoadFile>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const Root = (props) => {
    return (
        <div className='root' style={{
            display: 'flex'
        }} {...props} />
    )
}

const Sidebar = (props) => (
    <div className='sidebar' style={{
        width: '20vw',
        height: '100vh',
        overflow: 'auto',
        padding: '10px 0',
        background: '#eee'
    }} {...props} />
)

const SidebarItem = (props) => (
    <div className='sidebar-item' style={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        padding: '5px 10px'
    }} {...props} />
)

const Main = (props) => (
    <div className='main' style={{
        flex: '1',
        height: '100vh',
        overflow: 'auto'
    }} {...props} >
        <div style={{padding: '20px'}} {...props} />
    </div>
)

const Loading = (props) => (
    <div className='main' style={{
        padding: '5px 10px',
        textAlign: 'center',
        color: '#356ad2'
    }} {...props} >
        Loading... </div>
)

class LoadFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ""
        };
    }

    componentDidMount() {
        this.readTextFile(this.props.url);
    }

    componentWillReceiveProps(nextProps) {
        this.readTextFile(nextProps.url);
    }

    readTextFile = file => {
        fetch(file)
            .then(response => response.text())
            .then(responseText => {
                this.setState({
                    text: responseText
                });
            }).catch(function (ex) {
            this.setState({
                text: "Error"
            });
        })
    };

    getMarkdownText(text) {
        var rawMarkup = marked(text, {sanitize: true});
        return { __html: rawMarkup };
    }

    render() {
        return (
            <div>
                {this.state.text ? (
                    <div dangerouslySetInnerHTML={this.getMarkdownText(this.state.text)} />
                ) : (
                    <Loading/>
                )}
            </div>
        );
    }
}

export default App;
