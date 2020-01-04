<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avater_box">
                <img src="../assets/logo.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="less" scoped>
.login_container{
    background-color:#2b4b6b;
    height: 100%;

    .login_box{
        width: 500px;
        height: 300px;
        background-color: white;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avater_box{
            width: 130px;
            height: 130px;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px #ddd;
            background-color: #fff;
            padding: 10px;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
}
</style>
