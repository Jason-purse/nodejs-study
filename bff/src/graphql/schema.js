const { buildSchema } = require('graphql');
const mockDatabase = require('./mock-database')

const schema = buildSchema(`
    type Comment {
        id: Int
        avatar: String
        name: String
        isTop: Boolean
        content: String
        publishDate: String
        commentNum: Int
        praiseNum: Int
    }
    type Query {
        comment: [Comment]
    }
    type Mutation {
        praise(id: Int): Int
    }
`)

// 自定义了数据解析 ... (因为这里使用的是虚拟数据) ...
schema.getQueryType().getFields().comment.resolve = () => {
    return Object.keys(mockDatabase).map(key=> {
        return mockDatabase[key];
    })
}
schema.getMutationType().getFields().praise.resolve = (args0, { id }) => {
    mockDatabase[id].praiseNum++;

    return mockDatabase[id].praiseNum
}

module.exports = schema;