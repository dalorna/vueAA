<template>
<div class="og-modal-container">
    <div class="og-loading-indicator">
        <!-- <img class="close-btn" title="Close" src="../../../static/assets/img/SVGIcons/icon-close-circle-blue.svg" v-on:click="closeLoadingIndicator" /> -->
        <div class="og-loading-container">
            <div class="loading-text">
                <i class="fa fa-spinner fa-spin"></i>&nbsp;Loading...
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import {
        mapGetters
    } from "vuex";
    import router from "../../router";
    import enums from '../../utilities/enums';

    export default {
        name: 'LoadingIndicator',
        computed: {
            ...mapGetters([])
        },
        watch: {
        },
        methods: {
        },
    }
</script>

<style lang="less" scoped>

    .og-modal-container {
      width: 100%;
      max-width: 400px;
      margin: 200px auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
    }
    .og-loading-indicator {
        width: 100%;
        padding: 20px;
        text-align: center;
        position: relative;

        .og-loading-container {
            width: 250px;
            display: inline-block;

            .app-logo-container {
                text-align: center;
                padding: 40px 0px;

                .app-logo-wrapper {
                    position: relative;
                    display: inline-block;

                    .app-logo-border {
                        background: linear-gradient(60deg, #34699E, #34699E, #1F8BD5, #1F8BD5, #03C0E6, #03C0E6);
                        padding: 3px;
                        animation: rot 1s linear infinite;
                        border-style: solid;
                        border-color: transparent;
                        border-radius: 50%;
                        border-width: 1px;
                        width: 200px;
                        height: 200px;
                        -webkit-box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.18);
                        -moz-box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.18);
                        box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.18);
                    }

                    .app-logo {
                        width: 194px;
                        height: 194px;
                        position: absolute;
                        top: 3px;
                        left: 3px;
                    }

                    @keyframes rot {
                        0% {
                            transform: rotate(0deg)
                        }
                        25% {
                            transform: rotate(90deg)
                        }
                        50% {
                            transform: rotate(180deg)
                        }
                        75% {
                            transform: rotate(270deg)
                        }
                        100% {
                            transform: rotate(360deg)
                        }
                    }
                }
            }

            .loading-text {
                font-size: 25px;
                color: #1F8BD5
            }

            .loading-item {
                font-size: 16px;
                margin-top: 5px;
                text-align: left;
                color: #1F8BD5

                // &.is-completed {
                //     color: @Color-gray-md;

                //     .loading-item-text {
                //         text-decoration: line-through;
                //     }
                // }
            }
        }
    }
</style>