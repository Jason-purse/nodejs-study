const Container = require('../component/container.jsx');
const React = require('react');
const ReactDOM = require('react-dom');

/**
 * 相当于这里  使用客户端react 打包成js,然后重新挂载对应的节点(无刷新挂载) ....
 */

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: reactInitData,
            filtType: reactInitFiltType,
            sortType: reactInitSortType
        }
    }

    render() {
        return (
            <Container
                columns={this.state.columns}
                filt={(filtType) => {
                    fetch(`./data?sort=${this.state.sortType}&filt=${filtType}`)
                        .then(res => res.json())
                        .then(json => {
                            this.setState({
                                columns: json,
                                filtType: filtType
                            })
                        })
                }}
                sort={(sortType) => {
                    fetch(`./data?sort=${sortType}&filt=${this.state.filtType}`)
                        .then(res => res.json())
                        .then(json => {
                            this.setState({
                                columns: json,
                                sortType: sortType
                            })
                        })
                }}
            />
        )
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('reactapp')
)