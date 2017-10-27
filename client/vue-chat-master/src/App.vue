<script>
    import {actions} from './store';

    import Card from 'components/card';
    import List from 'components/list';
    import Text from 'components/text';
    import Message from 'components/message';
    import Login from './Login';
    export default {
        components: {Card, List, Text, Message,Login},
        vuex: {
            actions: actions,
            getters: {
                user: ({ user }) => user,
            }
        },
        created () {

        }
    }
</script>

<template>
    <div id="app">
        <div v-if="!user.name" class="divLogin">
            <Login></Login>
        </div>
        <div v-else class="divContent">
            <div class="sidebar">
                <card></card>
                <list></list>
            </div>
            <div class="main">
                <message></message>
                <text></text>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    #app {
        margin: 20px auto;
        width: 100%;
        height: 100%;

        overflow: hidden;
        border-radius: 3px;
		position: relative;

        .sidebar, .main {
            height: 100%;
        }
        .sidebar {
            float: left;
            width: 200px;
            color: #f4f4f4;
            background-color: #2e3238;
        }
        .main {
            position: relative;
            overflow: hidden;
            background-color: #eee;
        }
        .text {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
        }
        .message {
            height: ~'calc(100% - 160px)';
        }
    }

    .divContent{
        width: 100%;
        height:100%;
		position: relative;margin:auto; top: 0;left: 0;right: 0;bottom: 0;
    }

	.divLogin{
		width: 100%;
		height:100%;
		position: relative;margin:auto; top: 0;left: 0;right: 0;bottom: 0;
	}
</style>
