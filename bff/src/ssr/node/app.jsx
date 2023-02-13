const React = require('react')
const Container = require('../component/Container.jsx')

module.exports = function (reactData) {
    return <Container
        columns={reactData}
        filt={() => { }}
        sort={() => { }}
    />
}