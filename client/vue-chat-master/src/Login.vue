<template>
    <div id="content">
        <div class="login-header">
            <img src="/dist/images/im.png">
        </div>
        <form>
            <div class="login-input-box">
                <span class="icon icon-user"></span>
                <input type="text" v-model="login_user.uid" placeholder="Please enter your username">
            </div>
            <div class="login-input-box">
                <span class="icon icon-password"></span>
                <input type="password" v-model="login_user.pwd" placeholder="Please enter your password">
            </div>
        </form>
        <div class="login-button-box">
            <button @click="submitForm()">Login</button>
        </div>
        <div class="logon-box">
            <a href="">Forgot?</a>
            <a href="">Register</a>
        </div>
    </div>
</template>

<script>
    //import store from './store';
    import {actions} from './store';
    export default {
        name: 'Login',
        props: ['config'],
        vuex: {
            actions: actions,
            getters: {
                user: ({user}) => user
            }
        },
        data() {
            return {
                login_user: {
                    uid: '',
                    pwd: ''
                }
            };
        },
        methods: {
            submitForm() {
                this.validateAdminAccount(this.login_user);
            },
            validateAdminAccount(admin){
                if (admin.uid && admin.pwd === '123456') {
                    this.$store.state.user =
                        {
                            name: admin.uid,
                            img: 'dist/images/1.jpg'
                        };
                    this.REGISTER_CLIENT();
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    body {
        background: url("/dist/images/loginBg.jpg") no-repeat fixed;
        /* set background tensile */
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        margin: 0;
        padding: 0;
    }

    #content {
        background-color: rgba(255, 255, 255, 0.95);
        width: 420px;
        height: 300px;
        border: 1px solid #000000;
        border-radius: 6px;
        padding: 10px;
        margin-top: 15%;
        margin-left: auto;
        margin-right: auto;
        display: block;
    }

    .login-header {
        width: 100%;
        height: 48px;
        margin-bottom: 20px;
        border-bottom: 1px solid #dcdcdc;
    }

    .login-header img {
        width: 120px;
        width: 50px;
        margin-left: auto;
        margin-right: auto;
        display: block;
    }

    .login-input-box {
        margin-top: 12px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        display: inline-block;
    }

    .login-input-box input {
        width: 340px;
        height: 32px;
        margin-left: 18px;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        padding-left: 42px;
    }

    .login-input-box input:hover {
        border: 1px solid #ff7d0a;
    }

    .login-input-box input:after {
        border: 1px solid #ff7d0a;
    }

    .login-input-box .icon {
        width: 24px;
        height: 24px;
        margin: 6px 4px 6px 24px;
        background-color: #ff7d0a;
        display: inline-block;
        position: absolute;
        border-right: 1px solid #dcdcdc;
    }

    .login-button-box {
        margin-top: 12px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        display: inline-block;
    }

    .login-button-box button {
        background-color: #ff7d0a;
        color: #ffffff;
        font-size: 16px;
        width: 386px;
        height: 40px;
        margin-left: 18px;
        border: 1px solid #ff7d0a;
        border-radius: 4px;
    }

    .login-button-box button:hover {
        background-color: #ee7204;
    }

    .login-button-box button:active {
        background-color: #ee7204;
    }

    .logon-box {
        margin-top: 20px;
        text-align: center;
    }

    .logon-box a {
        margin: 30px;
        color: #4a4744;
        font-size: 13px;
        text-decoration: none;
    }

    .logon-box a:hover {
        color: #ff7d0a;
    }

    .logon-box a:active {
        color: #ee7204;
    }
</style>