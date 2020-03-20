export default {
    state: {
        uploadFrom: "",
        // todos: [
        //     { id: 1, text: '...', done: true },
        //     { id: 2, text: '...', done: false }
        // ],
    },
    mutations: { //逻辑处理，但Mutation 必须是同步函数
        // increment(state) {
        //     // 变更状态
        //     state.count++
        // },
        setUploadFrom(state, from) {
            state.uploadFrom = from
        },
    },
    getters: {  //针对state数据的过滤，
        // doneTodos: state => {
        //     return state.todos.filter(todo => todo.done)
        //   }
    },
    actions: {//Action 类似于 mutation,Action 提交的是 mutation，而不是直接变更状态;Action 可以包含任意异步操作.
        // setIncrement(context) {
        //     context.commit('increment')
        // },
        // 登录
        setUploadFrom({ commit }, { from }) {
            console.log(888, from)
            commit('setUploadFrom', from)
        },
    }
}
