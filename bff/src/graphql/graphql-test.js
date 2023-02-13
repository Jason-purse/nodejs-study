/**
 * graphql test
 */

const data = require('./mock-database')

const schema = require('./schema')
const {graphql} = require('graphql')

graphql({
    schema,
    source: `{comment{id,name,praiseNum}}`,
    rootValue: {
        comment: [
            {
                id: 1,
                avatar: 'https://static001.geekbang.org/account/avatar/00/0f/52/62/1b3ebed5.jpg',
                name: '僵尸浩',
                isTop: true,
                content: '哈哈哈哈',
                publishDate: '今天',
                commentNum: 10,
                praiseNum: 5
            }
        ]
    }
}).then(result => {
    Array.from(result.data.comment).forEach(ele  => {
        console.log(ele)
    })
})
